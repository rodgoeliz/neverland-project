var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require('mongoose');
var Bundle = require('../models/Bundle');
var PaymentMethod = require('../models/PaymentMethod');
var Card = require('../models/Card');
var Address = require('../models/Address');
var User = require('../models/User');
var Store = require('../models/Store');
var OrderInvoice = require('../models/OrderInvoice');
var OrderIntent = require('../models/OrderIntent');
var Order = require('../models/Order');
var OrderProductItem = require('../models/OrderProductItem');

const { getBuyerProtectionSurcharge, calculateBundleSubTotal, getFulfillmentMethod, calculateTaxSurcharge } = require("../utils/orderProcessor");

router.post('/product/remove', async function(req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let bundleId = req.body.bundleId;
  let orderIntentId = req.body.orderIntentId;
  // look up bundleId and remove the productOrderItem
  let orderIntent = await OrderIntent.findOne({_id: orderIntentId})
    .populate('bundleId')
    .populate({
      path: 'storeId',
      populate: {
        path: 'address'
      }})
    .populate('shippingAddressId')
  let bundle = await Bundle.findOne({_id: bundleId});
  let productOrderItems = bundle.productOrderItemIds.filter((product) => {
    return product._id != productOrderItemId;
  });
  const newBundle = await Bundle.findOneAndUpdate({_id: bundleId}, {
    $set: {
      productOrderItemIds: productOrderItems
    }
  }, {new: true});

  await OrderProductItem.findOneAndDelete({_id: productOrderItemId});

  const subtotal = await calculateBundleSubTotal(newBundle);
  console.log("NEW SUBTOTAL AFTER REMOAL: ", subtotal)
  const buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
  const shippingMethod = await getFulfillmentMethod("usps", "priority");
  const shippingCharge = shippingMethod.price;
  const taxSurcharge = await calculateTaxSurcharge(subtotal, orderIntent.shippingAddressId, shippingCharge, orderIntent.storeId.address);
  const total = subtotal + buyerSurcharge + shippingCharge;
  const surcharge = buyerSurcharge + shippingCharge;
  // if orderproductitem part of an order intent, we need to update the order intent with the new value and price
  let newOrderIntent = await OrderIntent.findOneAndUpdate(
    {_id: orderIntentId},
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
   {new: true});
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

router.post('/quantity/update', async function(req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let orderIntentId = req.body.orderIntentId;
  let amount = req.body.amount;
  let item = await OrderProductItem.findOne({_id: productOrderItemId});
  let orderIntent = await OrderIntent.findOne({_id: orderIntentId})
    .populate('bundleId')
    .populate({
      path: 'storeId',
      populate: {
        path: 'address'
      }})
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
    {_id: orderIntentId},
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
   {new: true});
  let updatedBundle = await Bundle.findOne({_id: orderIntent.bundleId}).populate('productOrderItemIds')
  res.json({
    success: true,
    payload: {
      product: product,
      orderIntent: newOrderIntent
  }});
});

router.get('/get/list', async function(req, res) {
  let userId = req.query.userId;
  try {

  let orders = await Order.find({userId: userId})
    .populate({
      path: 'paymentMethod', 
      populate: {
        path: 'billingAddress'
    }})
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
        }]}})
    .populate('orderInvoiceId');
    res.json({
      success: true,
      payload: orders
    });
  } catch(error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.get('/get', async function(req, res) {
  let orderId = req.query.id;
  try {
  let order = await Order.findOne({_id: orderId})
    .populate('paymentMethod')
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
        }]}})
    .populate('orderInvoiceId');
    res.json({
      success: true,
      payload: order
    });
  } catch(error){
    res.json({
      success: false,
      error: `Failed to fetch order ${orderId}`
    })
  }
});

router.post('/intent/create', async function(req, res) {
  let productId = req.body.productId;
  let bundleId = req.body.bundleId;
  let userId = req.body.userId;
  let storeId = req.body.storeId;
  let shippingAddressId = req.body.shippingAddressId;
  let paymentMethodId = req.body.paymentMethodId;
  let quantity = req.body.quantity;
  let variationOptionIds = req.body.selectedOptions;
  let now = new Date();

  if (productId && !bundleId)  {
    console.log("create new bundle and order product item")
    // create new order produt item
    let newOrderProductItem = new OrderProductItem({
      userId: userId,
      storeId: storeId,
      productId: productId,
      quantity: quantity,
      selectedOptionIds: variationOptionIds 
    });
    console.log(quantity)
    console.log(variationOptionIds)
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
  
  console.log("BUNDLE ID FOR ORDER INTENT: ", bundleId)
  let loadAllPromises = [];
  let shippingAddress = await Address.findOne({_id: shippingAddressId});
  let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId}).populate('card').populate('billingAddress');
  let user = await User.findOne({_id: userId});
  let store = await Store.findOne({_id: storeId}).populate('store');
  loadAllPromises.push(shippingAddress);
  loadAllPromises.push(paymentMethod);
  loadAllPromises.push(user);
  loadAllPromises.push(store);
  // if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
  // wrap around product
  loadAllPromises.push(await Bundle.findOne({_id: bundleId}).populate('productIds')
    .populate({path: 'productOrderItemIds', populate: 'productId'}));
  Promise.all(loadAllPromises).then(async (results) => {
    let shippingAddress = results[0];
    let paymentMethod = results[1];
    let user = results[2];
    let store = results[3];
    let bundle = results[4];
    console.log("BUNDLE", bundle)
    let subtotal = await calculateBundleSubTotal(bundle);
    subtotal = subtotal/100;
    let buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
    let shippingMethod = await getFulfillmentMethod("usps", "priority");
    let shippingCharge = shippingMethod.price;
    let taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
    let total = subtotal + buyerSurcharge + shippingCharge;
    let surcharge = buyerSurcharge + shippingCharge;

    let newOrderObject = new OrderIntent({
      createdAt: now,
      updatedAt: now,
      userId: userId,
      billingAddress: paymentMethod? paymentMethod.billingAddress._id: "",
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
      surcharges: surcharge,
      buyerSurcharge: Math.round(buyerSurcharge * 100),
      subtotal: subtotal,
      shipping: shippingCharge,
      taxes: taxSurcharge.taxAmount,
      taxableAmount: taxSurcharge.taxableAmount,
      total: total
    });
    let newOrder = await newOrderObject.save();
    res.json({
      success: true,
      payload: {
        orderIntent: newOrder,
        newBundle: bundle 
      }
    })

  });
});

router.post('/create', async function(req, res) {
	let productId = req.body.productId;
	let bundleId = req.body.bundleId;
  let productOrderItemId = req.body.productOrderItemId;
	let userId = req.body.userId;
	let storeId = req.body.storeId;
	let shippingAddressId = req.body.shippingAddressId;
	let paymentMethodId = req.body.paymentMethodId;
  let quantity = req.body.quantity;
  console.log("quantity", quantity)
  let variationOptionIds = req.body.variationOptionIds;
	let now = new Date();
	let bundle = null;
  if (!productOrderItemId && productId){
    let newProductOrderItemId = new OrderProductItem({
      createdAt: now,
      userId: userId,
      storeId: storeId,
      productId: productId,
      quantity: quantity,
      selectedOptionIds: req.body.variationOptionIds
    });
    productOrderItemId = await newProductOrderItemId.save();
    productOrderItemId = productOrderItemId._id;
  }
	//if productId only and not a bundle, create a bundle wrappi png that product.
  console.log("orderRouter PRODUCTID, BUNDLEID, POID", productId, bundleId, productOrderItemId)
	if (productId && !bundleId && productOrderItemId)	 {
		newBundle = new Bundle({
			isInternal: true,
			createdAt: now,
			updatedAt: now,
			userId: userId,
			storeId: storeId,
			productIds: [productId],
      productOrderItemIds: [productOrderItemId]
		});
		bundle = await newBundle.save();
		bundleId = bundle._id;
	}
	// Load shipping address, payment method, user, paymentMethod
	let loadAllPromises = [];
	let shippingAddress = await Address.findOne({_id: shippingAddressId});
	let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId}).populate('card').populate('billingAddress');
	let user = await User.findOne({_id: userId});
	let store = await Store.findOne({_id: storeId}).populate('store');
	loadAllPromises.push(shippingAddress);
	loadAllPromises.push(paymentMethod);
	loadAllPromises.push(user);
	loadAllPromises.push(store);
	// if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
	// wrap around product
	loadAllPromises.push(await Bundle.findOne({_id: bundleId}).populate('productIds'))
	Promise.all(loadAllPromises).then(async (results) => {
		let shippingAddress = results[0];
		let paymentMethod = results[1];
		let user = results[2];
		let store = results[3];
		let	bundle = results[4];
		let subtotal = await calculateBundleSubTotal(bundle);
		let buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
		let shippingMethod = await getFulfillmentMethod("usps", "priority");
		let shippingCharge = shippingMethod.price;
		let taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
		let total = subtotal + buyerSurcharge + shippingCharge;

		let surcharge = buyerSurcharge + shippingCharge;

    if (taxSurcharge) {
      surcharge += taxSurcharge.taxAmount;
      total += taxSurcharge.taxAmount;
    }
		// create payment
		let newOrderInvoice = new OrderInvoice({
			createdAt: now,
			updatedAt: now,
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
		let orderInvoice = await newOrderInvoice.save();
		let newOrderObject = new Order({
			createdAt: now,
			updatedAt: now,
			userId: userId,
      bundleId: bundleId,
      paymentMethod: paymentMethod,
			billingAddress: paymentMethod.billingAddress._id,
			storeId: storeId,
			orderInvoiceId: orderInvoice,
      status: "Need to Fulfill"
		});
		let newOrder = await newOrderObject.save();
		// stripe create a new  connect payment
		res.json({
			success: true,
			payload: newOrder
		})
		//process payment
	});
});

router.post('/delete', async function(req, res) {

});

router.post('/update', async function(req, res) {

});

router.post('/updateTracking', async function(req, res) {

});

module.exports = router;