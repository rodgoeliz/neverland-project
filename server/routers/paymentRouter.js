var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Address = require('../models/Address');
var Card = require('../models/Card');
var OrderIntent = require('../models/OrderIntent');
var User = require('../models/User');
var Order = require('../models/Order');
const statusTypes = require('../constants/statusTypes');
var PaymentMethod = require('../models/PaymentMethod');
var ProductTag = require('../models/ProductTag');
var SellerPayoutLog = require('../models/SellerPayoutLog');
const Logger = require('../utils/errorLogger');
const { createStripeAccountForUser, getStripeAccountForUser, createStripePayout } = require("../utils/paymentProcessor");
const { getEnvVariable } = require("../utils/envWrapper");
const stripe = require('stripe')(getEnvVariable('STRIPE_SECRET_KEY'));
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');

router.get('/stripe/seller/payouts', async function(req, res) {
  let sellerId = req.body.sellerId;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  try {
    const payouts = await SellerPayoutLog.find({
      $and: [
        {userId: sellerId},
        {isApproved: true},
        {
          $and: [{paidOutAt: {$gte: startDate}}, {paidOutAt: {$lte: endDate}}]
        }]
      })
      .populate('userId')
      .populate({
        path: 'orderId',
        populate: [{
          path: 'bundleId',
          populate: {
            path: 'productOrderItemIds',
            populate: [{path: 'selectedOptionIds'}, {path: 'productId'}]
          }
        }, {
          path: 'orderInvoiceId'
        }, {
          path: 'shippingAddressId'
        }, {
          path: 'paymentMethod',
          populate: {path: 'billingAddress'}
        }]});
    res.json({
      success: true,
      payload: payouts
    });
} catch (error) {
  console.log(error)
  Logger.logError(error);
  res.json({
    success: false,
    error: "Failed to fetch seller payouts."
  });
}
});

router.get('/stripe/seller/payout/approve', async function(req, res, next) {
  let sellerLogId = req.query.sellerPayoutLogId;
  console.log("APPROVE SELLER LOG ID: ", sellerLogId)
  try {
    const sellerPayoutLog = await SellerPayoutLog
      .findOne({_id: sellerLogId})
      .populate({
        path: 'userId',
        populate: {
          path: 'sellerProfile'
        }})
      .populate({
        path: 'orderId',
        populate:{
          path: 'orderInvoiceId'
        }});
      SellerPayoutLog.findOneAndUpdate({_id: sellerLogId}, { $set: {isApproved: true}});
      // payout via stripe IF WE CAN
      let results = await createStripePayout(sellerPayoutLog);
      if (results.success) {
        await Order.findOneAndUpdate({_id: sellerPayoutLog.orderId}, {$set: {status: statusTypes.order.PAID_OUT}}) ;
      } else {
        Logger.logError("Failed to payout seller log: " + sellerPayoutLog._id);
      }
      res.json({
        success: true,
        payload: sellerPayoutLog
      });
  } catch (error) {
    Logger.logError(error);
    console.log(error)
    res.json({
      success: false,
      error: "Couldn't approve payout: " + sellerLogId
    });
  }
  // update seller payout log
  // pull seller log with orderId
  // call stripe to pay out the amount of the order 
});

/**
*Test cases
  1/ Create a few orders from 3 days ago and some 3 days ago not delivered, some 2 days ago
  2/ Check whether they're pending pay out
  3/ Check wheether seller payout logs are generated
  4/ Call seller approve for payout log and check whether stripe payout was generated

*/
/**
  * Finds orders whose status has been delivered 3 days ago (4 increment to account for fully 3 days)
  * updates those orders with pay out pending automatically. Eventually we'll automate this
  **/
router.get('/stripe/seller/payout/process', async function(req, res, next) {
  let orderIds = [];
  let today = new Date(); // subtract 3 days
  today.setHours(0,0,0,0);
  let threeDaysAgoStartDate = new Date(); // subtract 3 days
  console.log(threeDaysAgoStartDate)
  threeDaysAgoStartDate.setHours(0,0,0,0);
  threeDaysAgoStartDate.setDate(threeDaysAgoStartDate.getDate()-4);
  let threeDaysAgoEndDate = new Date(); // subtract 3 days
  threeDaysAgoEndDate.setHours(23,59,59,999);
  threeDaysAgoEndDate.setDate(threeDaysAgoEndDate.getDate()-4);
  console.log("NOW: ", today)
  console.log("FIND ORDERS DELIVERED BETWEEN: ", threeDaysAgoStartDate, threeDaysAgoEndDate)
  try {
    const pendingPayoutOrders = await Order.find({$and :
      [
        {status: statusTypes.order.DELIVERED},
        {
          $and: [{deliveredAt: {$gte: threeDaysAgoStartDate}}, {deliveredAt: {$lte: threeDaysAgoEndDate}}]
        }
     ]});
    let updatePayoutPromises = [];
    pendingPayoutOrders.map((order) => {
      updatePayoutPromises.push(
        Order.findOneAndUpdate({_id: order._id}, {
        $set: {
          status: statusTypes.order.DELIVERED
        }
      }, {new: true})
        .populate({path: 'storeId', populate: {path: 'userId', populate: 'sellerProfile'}}).exec());
    });
    Promise.all(updatePayoutPromises).then(async (results) => {
      console.log("RESULATS FOR ODERS: ", results)
      let sellerLogPromises = [];
      results.map((order) => {
        console.log("ORDER: ", order)
        try {
        let newSellerPayoutLog = new SellerPayoutLog({
          payoutAmount: order.sellerPayout,
          isApproved: false,
          storeId: order.storeId,
          userId: order.storeId.userId, 
          stripeUID: order.storeId.userId.sellerProfile.stripeUID,
          orderId: order._id
        });
        sellerLogPromises.push(newSellerPayoutLog.save());
      } catch (error) {
        console.log(error)
      }
      });
      console.log("SELELR LOG PROMISES: ", sellerLogPromises.length)
      Promise.all(sellerLogPromises).then(async (results) => {
        res.json({
          success: true,
          payload: results 
        });
      });
    });
  } catch(error) {
    console.log("ERROR: ", error)
    Logger.logError(error);
    res.json({
      success: false,
      error
    });
  }
});

/**
  * Process payouts for all orders that have been deliverd more than 3 days ago.
  **/
router.post('/stripe/payouts/process', async function(req, res, next) {
  // get current date
  // find orders that were delivered 3 days ago
  // create a seller payout object to be approved
});

router.post('/stripe/confirm-payment-method-and-payment', async function(req, res, next) {
  const paymentMethodId = req.body.paymentMethodId;
  const paymentIntentId = req.body.paymentIntentId;
  const orderId = req.body.orderId;
  try {
    const paymentIntentConfirmation = await stripe.paymentIntents.confirm(paymentIntentId, {payment_method: paymentMethodId});
    await Order.findOneAndUpdate(
      {_id: orderId}, 
      {
        $set: {
          stripePaymentIntentId: paymentIntentConfirmation.id,
          stripeApplicationFeeAmount: paymentIntentConfirmation.application_fee_amount,
          stripeAmount: paymentIntentConfirmation.amount
        }
    });
    console.log("PAYMENT INTENT", paymentIntentConfirmation)
    res.json({
      success: true,
      payload: paymentIntentConfirmation
    });
  } catch (error) {
    Logger.logError(error);
    res.json({
      success: false, 
      payload: error
    });
  }

});

router.post('/stripe/create-payment-intent', async function(req, res, next) {
  let orderIntentId = req.body.orderIntentId;
  let userId = req.body.userId;
  // get charge amount
  
  let user = await User.findOne({_id: userId});
  let orderIntent = await OrderIntent.findOne({_id: orderIntentId}).populate({path: 'vendorId', populate: {path: 'sellerProfile'}});
  let orderTotal = Math.round(orderIntent.total);
  let buyerSurcharge = Math.round(orderIntent.buyerSurcharge);
  let stripeFeeSurcharge = Math.round(orderTotal * .029);
  console.log(orderTotal)
  console.log("ORDER INTENT TOTAL: ", orderTotal)
  console.log("ORDER BUYER SURCHARGE: ", buyerSurcharge)
  console.log("STRIPE FEE: ", stripeFeeSurcharge)
  // get vendor for product
  // get their stripe account connected id
  let sellerStripeAccountId = orderIntent.vendorId.sellerProfile.stripeUID;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderTotal,
      currency: 'usd',
      application_fee_amount: buyerSurcharge + stripeFeeSurcharge,
      transfer_data: {
        destination: sellerStripeAccountId
      },
      customer: user.stripeCustomerID,
      payment_method_types: ['card'],
    });
    res.json({
      success: true,
      payload: paymentIntent
    });
  } catch(error) {
    Logger.logError(error);
    res.json({
      success: false,
      error: error
    });
  }

});

router.post('/stripe/create-setup-intent', async function(req, res, next) {
  let userId = req.body.userId;
  let user = await User.findOne({_id: userId});
  try {
    const intent = await stripe.setupIntents.create({
      customer: user.stripeCustomerID
    });
    res.json({
      success: true,
      payload: intent
    });
  } catch(error) {
    Logger.logError(error);
    res.json({
      success: false,
      error: error
    });
  }
});

router.get('/get/default', async function(req, res, next) {
	let userId = req.query.userId;
	let paymentMethod = await PaymentMethod.find({userId: userId, isDefault: true}).populate('address');
	if (paymentMethod) {
		res.json({
			success: true,
			payload: paymentMethod	
		})
	} else {
    Logger.logError(new Error(`Failed to find payment method for user ${userId}`));
		res.json({
			success: true,
			error: {}
		});
	}
});

router.post('/method/update', async function(req, res, next) {
  console.log(req.body)
	let paymentMethodId = req.body.paymentMethodId;
	let updates = req.body.cardUpdates;
	let billingAddressUpdates = req.body.billingAddressUpdates;
	// update object by applying $set
	let existingPaymentMethod = await PaymentMethod.findOne({_id: paymentMethodId})
	.then(async (paymentMethod) => {
		let updatePromises = []; 
		updatePromises.push(Address.updateOne({_id: paymentMethod.billingAddress}, {
			$set: billingAddressUpdates
		}));
		updatePromises.push(Card.updateOne({_id: paymentMethod.card}, {
			$set: updates
		}));
		Promise.all(updatePromises).then(async (results) => {
			await PaymentMethod.findOne({_id: paymentMethodId}).populate('card').populate('billingAddress')
			.then((paymentMethod) => {
        console.log("UPDATED PAYMENT METHOD", paymentMethod)
				res.json({
					success: true,
					payload: paymentMethod
				});
			});
		});
	}).catch((error) => {
    Logger.logError(error);
	})

});

const createStripeCard = async (paymentMethod) => {
	var paymentMethod = await stripe.paymentMethods.create({
	  type: 'card',
	  card: {
	    number: '',
	    exp_month: 10,
	    exp_year: 2021,
	    cvc: '314',
	  },
	});
}

router.post('/method/delete', async function(req, res, next) {
  let paymentMethodId = req.body.paymentMethodId;
  try {
    await PaymentMethod.remove({_id: paymentMethodId});
    console.log(paymentMethodId)
    res.json({
      success: true,
      payload: paymentMethodId
    })
  } catch (error) {
    Logger.logError(error);
    res.json({
      success: false,
      error: "Failed to delete payment method."
    });
  }
});

/**
  Creates a payment method (ie a credit card, etc) for a user
  **/
router.post('/method/create', async function(req, res, next) {
	let tags = req.body.tags;
	let userId = req.body.userId;
	let type = req.body.type;
	let isSameAsShipping = req.body.isSameAsShipping;
  let stripePaymentMethodId = req.body.stripePaymentMethodId;
	let shippingAddressId = req.body.shippingAddressId;
	let method = req.body.paymentMethod;
  let stripeToken = req.body.stripeToken;
	let isDefaultMethod = req.body.isDefaultMethod;
	let billingAddress = req.body.billingAddressInfo;
	let cardNumber = req.body.cardNumber;
	let now = new Date();
	let existingAddress = null;
	let user = await User.findOne({_id: userId});
	if (isSameAsShipping) {
		existingAddress = await Address.findOne({_id: shippingAddressId}).lean();
		delete existingAddress._id;
	}

  const paymentMethod = await stripe.paymentMethods.attach(
    stripePaymentMethodId,
    {customer: user.stripeCustomerID}
  );

  console.log("Create payment method", paymentMethod, process.env.STRIPE_SECRET_KEY)
	if (existingAddress == null) {
		existingAddress = new Address({
			createdAt: now,
			updatedAt: now,
			isActive: true,
			isDefault: isDefaultMethod,
			isBillingAddress: true,
			addressCity: billingAddress.addressCity,
			addressCountry: billingAddress.addressCountry,
			addressLine1: billingAddress.addressLine1,
			addressLine2: billingAddress.addressLine2,
			addressZip: billingAddress.addressZip,
		});

	}

	let newBillingAddress = new Address(existingAddress);
	// if billing address is same as shipping address, then look up shipping address
	// find matching address, if exists, do not create
	newBillingAddress.isBillingAddress = true;
	newBillingAddress.isShippingAddress = false;

   try {
      await newBillingAddress.save()
    .then((address) => {
      //TODO create a new stripeid for this card
      let card = new Card({
        createdAt: now,
        updatedAt: now,
        type: method.type,
        name: method.name,
        expMonth: method.expMonth,
        expYear: method.expYear,
        country: method.country,
        zipCode: method.zipCode,
        last4: method.last4,
        address: address
      });
      card.save()
        .then((card) => {
          let paymentMethod = new PaymentMethod({
            userId: userId,
            stripeToken: stripeToken,
            type: "card",
            billingAddress: address,
            card: card,
            stripePaymentMethodId: stripePaymentMethodId,
            isActive: true,
            isDefault: isDefaultMethod
          });
          paymentMethod.save()
            .then((paymentMethod) => {
              PaymentMethod.populate(paymentMethod, {path: 'card'}).then((method)=> {
                // create a stripe method
                res.json({
                  success: true,
                  payload:method 
                });
              })
            })
            .catch((error) => {
              Logger.logError(error);
              res.json({
                success: false,
                error: "Failed to create payment method."
              })
            });
        })

    });

   } catch(error) {
    Logger.logError(error);
    res.json({
      success: false,
      error: "Failed to create payment Method"
    });
  }

});

router.post('/create', function(req, res, next) {
	let tags = req.body.tags;
	let promises = tags.map((tag) => {
		let handle = tag;
		handle = handle.replace(/\s+/g, '-').toLowerCase();
		var newProductTag = new ProductTag({
			createdAt: new Date(),
			title: tag,
			handle: handle
		});
		return new Promise ((resolve, reject) => {
			newProductTag.save(function(err, productTag) {
				if (err) {
					reject(err);
				}
				resolve(productTag);
			});
		});
	});
	Promise.all(promises).then((results, err) => {
		res.json({});
	});
});

router.post('/delete', async function(req, res, next) {
	let addressId = req.body.addressId;
	await Address.remove({_id: addressId}, function(err) {
		if (err) {
      Logger.logError(err);
			res.json({
				success: false,
				error: err
			});
		} else {
			res.json({
				success: true
			});
		}
	});	
});

router.post('/setDefault', async function(req, res, next) {
	let addressId = req.body.addressId;
	let address = await Address.findOne({_id: addressId})
		.then((address) => {
			address.isDefault = true;
			address.save()
				.then((address) => {
					res.json({
						success: true,
						payload: address
					});
				})
				.catch((error) => {
          Logger.logError(error);
					res.json({
						success: false,
						error: `Failed to save address as default: ${addressId}`
					});
				});
		}).catch((error) => {
      Logger.logError(error);
			res.json({
				success: false,
				error: `Failed to set default for address: ${addressId}`
			})
		})
})

/**
Returns an array of addresses. if by address id, will return array of one
**/
router.get('/get', async function(req, res, next) {
	let userId = req.query.userId;
	let addressId = req.query.addressId;
	let query = {};
	if (userId) {
		query.userId = userId;
	} else if (addressId) {
		query.addressId = addressId
	}

	let address = await Address
		.find(query)
		.then((address) => {
			res.json({
				success: true,
				address: address
			});
		})
		.catch((error) => {
      Logger.logError(error);
			res.json({
				success: false,
				error: `Failed to fetch address for this userId: ${userId} or addressId: ${addressId}`
			});
		});

})

module.exports = router;