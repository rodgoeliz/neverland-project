var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Address = require('../models/Address');
var Card = require('../models/Card');
var PaymentMethod = require('../models/PaymentMethod');
var ProductTag = require('../models/ProductTag');
const mongoose = require('mongoose');

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

router.post('/method/delete', async function(req, res, next) {
	let paymentMethodId = req.body.paymentMethodId;
	let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId})
		.then(async (paymentMethod) => {
			let cardId = paymentMethod.card;
			let billingAddressId = paymentMethod.billingAddress;
			let allDeletePromises = [];
			allDeletePromises.push(await PaymentMethod.deleteOne({_id: paymentMethodId}));
			allDeletePromises.push(await Card.deleteOne({_id: cardId}));
			allDeletePromises.push(await Address.deleteOne({_id: billingAddressId}));
			Promise.all(allDeeltePromises).then((results) => {
				res.json({
					success: true,
					payload: {}	
				});
			});
		}).catch((error) => {
			res.json({
				success: false,
				error: "Failed to deep delete payment method."
			})
		});
});

router.post('/method/update', async function(req, res, next) {
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

/**
  Creates a payment method (ie a credit card, etc) for a user
  **/
router.post('/method/create', async function(req, res, next) {
	let tags = req.body.tags;
	let userId = req.body.userId;
	let type = req.body.type;
	let isSameAsShipping = req.body.isSameAsShipping;
	let shippingAddressId = req.body.shippingAddressId;
	let method = req.body.paymentMethod;
	let isDefaultMethod = req.body.isDefaultMethod;
	let billingAddress = req.body.billingAddressInfo;
	let now = new Date();
	let existingAddress = null;
	console.log("payment method input")
	console.log(method)
	console.log("isdefaultmethod: " + isDefaultMethod)
	if (isSameAsShipping) {
		console.log("SAME AS SHIPPING ADDRESS")
		existingAddress = await Address.findOne({_id: shippingAddressId}).lean();
		console.log("SHIPPING ADDRESS")
		console.log(existingAddress)
		delete existingAddress._id;
	}

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
			userId: userId
		});

	}

	let newBillingAddress = new Address(existingAddress);
	// if billing address is same as shipping address, then look up shipping address
	// find matching address, if exists, do not create
	newBillingAddress.isBillingAddress = true;
	newBillingAddress.isShippingAddress = false;
	await newBillingAddress.save()
		.then((address) => {
			console.log("cREATE NEW CARD")
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
			console.log(card)
			card.save()
				.then((card) => {
					console.log("Create new payment method...")
					let paymentMethod = new PaymentMethod({
						userId: userId,
						type: "card",
						billingAddress: address,
						card: card,
						isActive: true,
						isDefault: isDefaultMethod
					});
					console.log(paymentMethod);
					paymentMethod.save()
						.then((paymentMethod) => {
							console.log(paymentMethod)
							paymentMethod.populate('card').then((method)=> {
								res.json({
									success: true,
									payload:method 
								});
							})
						})
						.catch((error) => {
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