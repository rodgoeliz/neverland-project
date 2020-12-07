var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Address = require('../models/Address');
var Card = require('../models/Card');
var OrderIntent = require('../models/OrderIntent');
var User = require('../models/User');
var PaymentMethod = require('../models/PaymentMethod');
var ProductTag = require('../models/ProductTag');
const { createStripeAccountForUser, getStripeAccountForUser } = require("../utils/paymentProcessor");
const { getEnvVariable } = require("../utils/envWrapper");
const stripe = require('stripe')(getEnvVariable('STRIPE_SECRET_KEY'));
const mongoose = require('mongoose');

router.post('/stripe/confirm-payment-method-and-payment', async function(req, res, next) {
  let paymentMethodId = req.body.paymentMethodId;
  let paymentIntentId = req.body.paymentIntentId;
  try {
    const paymentIntentConfirmation = await stripe.paymentIntents.confirm(paymentIntentId, {payment_method: paymentMethodId});
    res.json({
      success: true,
      payload: paymentIntentConfirmation
    });
  } catch (error) {
    console.log("error in paymentintentconfirmation")
    console.log(error)
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
  let orderTotal = Math.round(orderIntent.total * 100);
  // get vendor for product
  // get their stripe account connected id
  let sellerStripeAccountId = orderIntent.vendorId.sellerProfile.stripeUID;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderTotal,
      currency: 'usd',
      application_fee_amount: orderIntent.buyerSurcharge,
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
		console.log(error)
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
    console.log(error)
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



	 let billingAddressStripeInput = {
	 	address: {
	  	 city: "San Francisco TEST",
	  	 country: "US"	,
	  	 line1: newBillingAddress.addressLine1,
	  	 line2: newBillingAddress.addressLine2,
	  	 postal_code: newBillingAddress.addressZip,
	  	 state: newBillingAddress.addressState
	 	}
	 }

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
							console.log(error)
							res.json({
								success: false,
								error: "Failed to create payment method."
							})
						});
				})

		});
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
					res.json({
						success: false,
						error: `Failed to save address as default: ${addressId}`
					});
				});
		}).catch((error) => {
			console.log(error);
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
			console.log("Failed to find address")
			console.log(error)
			res.json({
				success: false,
				error: `Failed to fetch address for this userId: ${userId} or addressId: ${addressId}`
			});
		});

})

module.exports = router;