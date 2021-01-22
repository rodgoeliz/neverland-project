var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require('mongoose');
const { getEnvVariable } = require("../utils/envWrapper");
var Bundle = require('../models/Bundle');
var PaymentMethod = require('../models/PaymentMethod');
var Card = require('../models/Card');
var Address = require('../models/Address');
var User = require('../models/User');
var Store = require('../models/Store');
var OrderInvoice = require('../models/OrderInvoice');
const Logger = require('../utils/errorLogger');
var OrderIntent = require('../models/OrderIntent');
var Order = require('../models/Order');
var Product = require('../models/Product');
var OrderProductItem = require('../models/OrderProductItem');
const pdf = require('html-pdf');
const fs = require('fs');
const orderTemplate = require('../documents/orderTemplate');
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const shippo = require('shippo')(getEnvVariable('SHIPPO'));

const { getBuyerProtectionSurcharge, getStripeFee, calculateBundleSubTotal, getFulfillmentMethod, calculateTaxSurcharge, generateOrderNumber } = require("../utils/orderProcessor");

/** INTERNAL METHODS **/
router.get('/algolia/load', async function (req, res) {
  console.log("Uploading orders to algolia....")
  let orders = await Order.find({})
    .populate('userId')
    .populate({
      path: 'bundleId',
      populate: {
        path: 'productOrderItemIds',
        populate: {
          path: 'productId'
        }
      }})
    .populate('orderInvoiceId')
    .populate('storeId')
    .populate({ path: 'paymentMethod', populate: 'billingAddress' })
    .populate('shippingAddressId');
  const transformedOrders = orders.map((order) => {
    try {
      let object = order.toObject();
      object.objectID = order._id;
      return object;
    } catch (error) {
      console.log(error)
    }
  });
  console.log(transformedOrders.length)
  try {
    console.log("initializing " + getEnvVariable('ALGOLIA_ORDER_INDEX'))
    const index = algoliaClient.initIndex(getEnvVariable('ALGOLIA_ORDER_INDEX'));
    index.saveObjects(transformedOrders, { 'autoGenerateObjectIDIfNotExist': true })
      .then(({ objectIDs }) => {
        console.log("Loaded orders into algolia...")
      }).catch(err => {
        // log error
        console.log("error updating to algolia order index: ", err)
      });

  } catch (error) {
    console.log(error)
  }
});

router.post('/product/remove', async function (req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let bundleId = req.body.bundleId;
  let orderIntentId = req.body.orderIntentId;
  // look up bundleId and remove the productOrderItem
  let orderIntent = await OrderIntent.findOne({ _id: orderIntentId })
    .populate('bundleId')
    .populate({
      path: 'storeId',
      populate: {
        path: 'address'
      }
    })
    .populate('shippingAddressId')
  let bundle = await Bundle.findOne({ _id: bundleId });
  let productOrderItems = bundle.productOrderItemIds.filter((product) => {
    return product._id != productOrderItemId;
  });
  const newBundle = await Bundle.findOneAndUpdate({ _id: bundleId }, {
    $set: {
      productOrderItemIds: productOrderItems
    }
  }, { new: true });

  await OrderProductItem.findOneAndDelete({ _id: productOrderItemId });

  const subtotal = await calculateBundleSubTotal(newBundle);
  const buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
  const shippingMethod = await getFulfillmentMethod("usps", "priority");
  const shippingCharge = shippingMethod.price;
  const taxSurcharge = await calculateTaxSurcharge(subtotal, orderIntent.shippingAddressId, shippingCharge, orderIntent.storeId.address);
  const total = subtotal + buyerSurcharge + shippingCharge;
  const surcharge = buyerSurcharge + shippingCharge;
  // if orderproductitem part of an order intent, we need to update the order intent with the new value and price
  let newOrderIntent = await OrderIntent.findOneAndUpdate(
    { _id: orderIntentId },
    {
      $set: {
        subtotal,
        buyerSurcharge,
        price: {
          value: subtotal,
          currency: 'USD'
        },
        shipping: shippingCharge,
        taxes: taxSurcharge.taxAmount,
        taxableAmount: taxSurcharge.taxableAmount,
        total
      }
    },
    { new: true });
  console.log("NEW ORDER INTENT: ", newOrderIntent)
  res.json({
    success: true,
    payload: {
      bundle,
      orderIntent: newOrderIntent
    }
  });
  // find order Intent and remove the associated index with productOrderItemId
  // delete productOrderItemId 
  // return updated orderIntentId
});

/* Cron job endpoint to check shipping status of orders and update
 the ones that've been delivered */
router.get('/tracking/job/status', async function(req, res) {
  const allOrders = await Order.find({$or: [{status: 'need-to-fulfill'}, {status: 'shipped'}]});
  let allShipmentPromises = [];
  const orderIdToShipMap = {};
  allShipmentPromises = allOrders.filter((order) => {
      return order.trackingInfo && order.trackingInfo.trackingId && order.trackingInfo.carrier;
  })
  const orderIds = [];
  try {
    allShipmentPromises = allShipmentPromises.map(async (order) => {
      orderIds.push(order._id);
      const trackingNumber = order.trackingInfo.trackingId;
      const carrier = order.trackingInfo.carrier;
      orderIdToShipMap[order._id] = shippo.track.create({
        carrier: carrier,
        tracking_number: trackingNumber
      });

      return shippo.track.create({
        carrier: carrier,
        tracking_number: trackingNumber
      });
    });
    const updateOrderPromises = [];
    Promise.all(allShipmentPromises).then((results, idx) => {
      results.map((shippingInfo, idx) => {
        const orderId = orderIds[idx];
        const trackingStatus = shippingInfo.tracking_status;
        if (trackingStatus && trackingStatus.status == 'DELIVERED') {
          updateOrderPromises.push(Order.findOneAndUpdate({_id: orderId}, 
            {$set:
                {
                  status: 'delivered',
                  deliveredAt: trackingStatus.object_updated
                }
            }, {new: true}));
        }
      });

        // for all where status is delivered, we trigger the delivered hook.
      Promise.all(updateOrderPromises).then((results, error) => {
        res.json({success: true});
      });
    });
  } catch(error) {
    Logger.logError(error);
  }
});

router.post('/tracking/update', async function (req, res) {
  const orderId = req.body.orderId;
  const trackingNumber = req.body.trackingNumber;
  const trackingCarrier = req.body.trackingCarrier;
  if (!trackingNumber) {
    res.json({
      success: false,
      error: "Please provide correct tracking number."
    });
  }
  if (!trackingCarrier) {
    res.json({
      success: false,
      error: "Please provide accurate shipping carrier."
    });
  }
  if (!orderId) {
    res.json({
      success: false,
      error: "Please provide accurate order identifier."
    });
  }
  try {
    await Order.findOneAndUpdate(
      {
        _id: orderId
      }, {
      $set: {
        trackingInfo: {
          trackingId: trackingNumber,
          carrier: trackingCarrier
        }
      }
    }, {
      new: true
    })
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.post('/quantity/update', async function (req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let orderIntentId = req.body.orderIntentId;
  let amount = req.body.amount;
  let item = await OrderProductItem.findOne({ _id: productOrderItemId });
  let orderIntent = await OrderIntent.findOne({ _id: orderIntentId })
    .populate('bundleId')
    .populate({
      path: 'storeId',
      populate: {
        path: 'address'
      }
    })
    .populate('shippingAddressId')
  if (!item) {
    res.json({
      success: false,
      error: 'Failed to find the product.'
    });
  }
  if (!orderIntent) {
    res.json({
      success: false,
      error: "Could not find the order associated with this product and user."
    });
  }

  //const oldQ = item.quantity;
  //const newAmount = Math.max(oldQ - amount, 0);
  let updateQuery = {
    $set: {
      quantity: amount
    }
  };
  let product = await OrderProductItem.findOneAndUpdate(
    { _id: productOrderItemId },
    updateQuery,
    { new: true });
  const subtotal = await calculateBundleSubTotal(orderIntent.bundleId);
  const buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
  const shippingMethod = await getFulfillmentMethod("usps", "priority");
  const shippingCharge = shippingMethod.price;
  const taxSurcharge = await calculateTaxSurcharge(subtotal, orderIntent.shippingAddressId, shippingCharge, orderIntent.storeId.address);
  const total = subtotal + buyerSurcharge + shippingCharge;
  const surcharge = buyerSurcharge + shippingCharge;
  // if orderproductitem part of an order intent, we need to update the order intent with the new value and price
  let newOrderIntent = await OrderIntent.findOneAndUpdate(
    { _id: orderIntentId },
    {
      $set: {
        subtotal,
        buyerSurcharge,
        price: {
          value: subtotal,
          currency: 'USD'
        },
        shipping: shippingCharge,
        taxes: taxSurcharge.taxAmount,
        taxableAmount: taxSurcharge.taxableAmount,
        total
      }
    },
    { new: true });
  let updatedBundle = await Bundle.findOne({ _id: orderIntent.bundleId }).populate('productOrderItemIds')
  res.json({
    success: true,
    payload: {
      product: product,
      orderIntent: newOrderIntent
    }
  });
});

router.get('/get/list', async function (req, res) {
  let userId = req.query.userId;
  try {

    let orders = await Order.find({ userId: userId })
      .populate({
        path: 'paymentMethod',
        populate: {
          path: 'billingAddress'
        }
      })
      .populate('shippingAddressId')
      .populate('billingAddress')
      .populate('storeId')
      .populate({
        path: 'bundleId',
        populate: {
          path: 'productOrderItemIds',
          populate: [{
            path: 'productId',
            populate: {
              path: 'variationIds',
              populate: {
                path: 'optionIds'
              }
            }
          }, {
            path: 'selectedOptionIds'
          }]
        }
      })
      .populate('orderInvoiceId');
    res.json({
      success: true,
      payload: orders
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.get('/get', async function (req, res) {
  let orderId = req.query.id;
  try {
    let order = await Order.findOne({ _id: orderId })
      .populate('paymentMethod')
      .populate('storeId')
      .populate('shippingAddressId')
      .populate({
        path: 'billingAddress',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .populate({
        path: 'bundleId',
        populate: {
          path: 'productOrderItemIds',
          populate: [{
            path: 'productId',
            populate: {
              path: 'variationIds',
              populate: {
                path: 'optionIds'
              }
            }
          }, {
            path: 'selectedOptionIds'
          }]
        }
      })
      .populate('orderInvoiceId');
    res.json({
      success: true,
      payload: order
    });
  } catch (error) {
    res.json({
      success: false,
      error: `Failed to fetch order ${orderId}`
    })
  }
});

router.post('/intent/create', async function (req, res) {
  console.log("intent/create")
  try {

  let productId = req.body.productId;
  let bundleId = req.body.bundleId;
  let userId = req.body.userId;
  let storeId = req.body.storeId;
  let shippingAddressId = req.body.shippingAddressId;
  let paymentMethodId = req.body.paymentMethodId;
  let quantity = req.body.quantity;
  let variationOptionIds = req.body.selectedOptions;
  let now = new Date();

  if (productId && !bundleId) {
    // create new order produt item
    let newOrderProductItem = new OrderProductItem({
      userId: userId,
      storeId: storeId,
      productId: productId,
      quantity: quantity,
      selectedOptionIds: variationOptionIds
    });
    let nOPI = await newOrderProductItem.save();
    newBundle = new Bundle({
      isInternal: true,
      createdAt: now,
      updatedAt: now,
      userId: userId,
      storeId: storeId,
      productOrderItemIds: [nOPI._id]
    });
    bundle = await newBundle.save();

    bundleId = bundle._id;
  }

  const user = await User.findOne({ _id: userId });
  const store = await Store.findOne({ _id: storeId }).populate('store');
  const loadAllPromises = [];
  loadAllPromises.push(user);
  loadAllPromises.push(store);
  // if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
  // wrap around product
  loadAllPromises.push(await Bundle.findOne({ _id: bundleId })
    .populate({
      path: 'productOrderItemIds',
      populate: [{ path: 'productId' }, { path: 'selectedOptionIds' }]
    })
    .populate({
      path: 'storeId',
      populate: [{
        path: 'packageProfileIds'
      },
      { path: 'businessAddress' }
      ]
    }));


  let shippingAddress = null;
  if (shippingAddressId) {
    shippingAddress = await Address.findOne({ _id: shippingAddressId });
  }
  loadAllPromises.push(shippingAddress);
  let paymentMethod = null;
  if (paymentMethodId) {
    paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId }).populate('card').populate('billingAddress');
  }
  loadAllPromises.push(paymentMethod);
  console.log("PUSH ALL PROMISES")
  Promise.all(loadAllPromises).then(async (results) => {
    const user = results[0];
    const store = results[1];
    const bundle = results[2];
    const shippingAddress = results[3];
    const paymentMethod = results[4];
    const subtotal = await calculateBundleSubTotal(bundle);
    const buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
    console.log("calculated charges...")
    // shipping is free for everyone right now
    //const shippingChargeDetails = await calculateShippingFromBundle(bundle, store)
   const shippingCharge = 0; //shippingCharge.shippingCost;
    //const sellerSurcharge = shippingCharge.sellerSurcharge;
    const shippoDetails = null;
 /*   if (shippingChargeDetails.shippo) {
      shippoDetails = {
        shipmentId: shippingChargeDetails.shippo.shipmentId,
        ratesId: shippingChargeDetails.shippo.ratesId
      }
    }*/
    let taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
    let total = subtotal + buyerSurcharge + shippingCharge;
    let surcharge = buyerSurcharge + shippingCharge;
    console.log("Creating order intent obj...")
    let newOrderObject = new OrderIntent({
      createdAt: now,
      updatedAt: now,
      userId: userId,
      billingAddress: paymentMethod ? paymentMethod.billingAddress._id : "",
      shippingAddressId: shippingAddress,
      storeId: storeId,
      price: {
        value: subtotal,
        currency: 'USD'
      },
      storeId: storeId,
      bundleId: bundleId,
      vendorId: store.userId,
      effectiveTaxRate: taxSurcharge.rate,
      paymentMethod: paymentMethod,
      surcharges: surcharge,
      // TODO ADD LATER - shippo sellerSurcharge,
      buyerSurcharge: Math.round(buyerSurcharge),
      subtotal: subtotal,
      shipping: shippingCharge,
      taxes: taxSurcharge.taxAmount,
      // TODO ADD LATER shippoDetails,
      taxableAmount: taxSurcharge.taxableAmount,
      total: total
    });
    console.log("ORDER SAVINGS...")
    let newOrder = await newOrderObject.save();
    console.log("ORDER INT#ENT:", newOrder)
    res.json({
      success: true,
      payload: {
        orderIntent: newOrder,
        newBundle: bundle
      }
    })

  });

  } catch (error) {
    console.log(error)
  }
});

router.post('/create', async function (req, res) {
  // order intent
  console.log("Create Order Intent: ", req.body)
  const orderIntentId = req.body.orderIntentId;
  const orderIntent = await OrderIntent.findOne({ _id: orderIntentId })
    .populate('shippingAddressId')
    .populate({
      path: 'bundleId',
      populate: {
        path: 'productOrderItemIds',
        populate: 'productId'
      }
    })
    .populate({ path: 'paymentMethod', populate: 'billingAddress' })
    .populate('storeId')
    .populate('userId');
  let productId = req.body.productId;
  let bundleId = req.body.bundleId;
  let productOrderItemId = req.body.productOrderItemId;
  let userId = req.body.userId;
  let storeId = req.body.storeId;
  let shippingAddressId = req.body.shippingAddressId;
  let paymentMethodId = req.body.paymentMethodId;
  let quantity = req.body.quantity;
  let variationOptionIds = req.body.variationOptionIds;
  let now = new Date();
  // Load shipping address, payment method, user, paymentMethod
  let loadAllPromises = [];
  const shippingAddress = await Address.findOne({_id: req.body.shippingAddressId});
  const paymentMethod = await PaymentMethod.findOne({_id: req.body.paymentMethodId});
  const user = orderIntent.userId;
  const store = orderIntent.storeId;
  const bundle = orderIntent.bundleId;
  // if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
  // wrap around product
  const subtotal = await calculateBundleSubTotal(bundle);
  const buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
  const shippingMethod = await getFulfillmentMethod("usps", "priority");
  const shippingCharge = 0;
  const taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
  const total = subtotal + buyerSurcharge + shippingCharge;
  const stripeFee = await getStripeFee(total);
  let surcharge = shippingCharge + buyerSurcharge;
  if (taxSurcharge) {
    surcharge += taxSurcharge.taxAmount;
    total += taxSurcharge.taxAmount;
  }
  const sellerPayout = total - buyerSurcharge - stripeFee;
  console.log("TOTAL: ", total, orderIntent.total)
  if (total == orderIntent.total) {
    try {
      let newOrderInvoice = new OrderInvoice({
        createdAt: now,
        updatedAt: now,
        sellerPayout,
        bundleId: bundle._id,
        price: {
          value: subtotal,
          currency: 'USD'
        },
        effectiveTaxRate: taxSurcharge.rate,
        surcharges: surcharge,
        subtotal: subtotal,
        shipping: shippingCharge,
        taxes: taxSurcharge.taxAmoun,
        taxableAmount: taxSurcharge.taxableAmount,
        total: total
      });
      console.log("NEW OrDER INVOCIE: ", newOrderInvoice)
      let orderInvoice = await newOrderInvoice.save();
      const orderNumber = await generateOrderNumber();
      let newOrderObject = new Order({
        createdAt: now,
        updatedAt: now,
        userId: userId,
        sellerPayout,
        orderNumber,
        bundleId: bundle._id,
        paymentMethod: paymentMethod,
        billingAddress: paymentMethod.billingAddress._id,
        shippingAddressId: shippingAddress,
        storeId: store._id,
        orderInvoiceId: orderInvoice,
        status: "need-to-fulfill"
      });
      let newOrder = await newOrderObject.save();
        // update product sold
      const productPromises = bundle.productOrderItemIds.map((productOrderItem) => {
          const quantity = productOrderItem.quantity;
          return Product.findOneAndUpdate({_id: productOrderItem.productId._id}, {
            $inc: {
              inventorySold: quantity,
              inventoryInStock: -quantity,
              inventoryAvailableToSell: -quantity
            }
          }, {
            new: true
          });
        });
      Promise.all(productPromises).then(async (results) => {
        console.log("UPdated product quantities...", results)
        //updated product quantities
        const updatedOrder = await Order.findOne({ _id: newOrder._id })
          .populate('paymentMethod')
          .populate('billingAddress')
          .populate('shippingAddressId')
          .populate('storeId')
          .populate('orderInvoiceId')
          .populate({
            path: 'bundleId',
            populate: {
              path: 'productOrderItemIds',
              populate: [{
                path: 'productId'
              }, {
                path: 'selectedOptionIds'
              }]
            }
          });
          console.log("updated order...", updatedOrder)
        // stripe create a new  connect payment
        res.json({
          success: true,
          payload: updatedOrder
        });
      });
    } catch (error) {
      console.log(error);
      Logger.logError(error);
    }
  } else {
    res.json({
      success: false,
      error: "Order total doesn't match intent total."
    });
    Logger.logError("[HIGH PRI] Order total doesn't equal order intent total: " + orderIntent._id);
  }
});

router.post('/delete', async function (req, res) {

});

router.post('/update', async function (req, res) {

});

router.post('/updateTracking', async function (req, res) {

});


router.post('/order-pdf', (req, res) => {
  pdf.create(orderTemplate(req.body)).toFile(`${__dirname}/documents/order.${req.query.id}.pdf`, (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
});

router.get('/order-pdf', (req, res) => {
  res.sendFile(`${__dirname}/documents/order.${req.query.id}.pdf`);
})

router.delete('/order-pdf', (req, res) => {
  fs.unlinkSync(`${__dirname}/documents/order.${req.query.id}.pdf`);
  res.send({});
})

module.exports = router;