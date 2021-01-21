var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Store = require('../models/Store');
var ProductTag = require('../models/ProductTag');
var Address = require('../models/Address');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const formidable = require('formidable');

router.post('/update', async function(req, res, next) {
	let addressInfo = req.body.address;
	let saveAsDefault = req.body.saveAsDefault;
	let addressId = req.body.addressId;
	let userId = req.body.userId;
	let now = new Date();
	let existingAddress = await Address.findOne({_id: addressId});
  if (saveAsDefault) {
    const defaultAddresses = await Address.find({userId: userId, isDefault: true});
    defaultAddresses.map(async (address) => {
      await Address.findOneAndUpdate({_id: address._id}, {$set: {isDefault: false}});
    })
  }
	await Address.findOneAndUpdate({_id: addressId}, {
			updatedAt: now,
			isDefault: saveAsDefault,
			isShippingAddress: true,
			isActive: true,
			fullName: addressInfo.fullName,
			addressState: addressInfo.addressState,
			addressCity: addressInfo.addressCity,
			addressCountry: addressInfo.addressCountry,
			addressLine1: addressInfo.addressLine1,
			addressLine2: addressInfo.addressLine2,
			addressZip: addressInfo.addressZip,
			userId: userId
	}, {new: true, useFindAndModify: true}).then((address) => {
		Address.populate(address, { path: 'userId'}).then((address) => {
			res.json({
				success: true,
				payload: address
			});
		})
	}).catch((error) => {
		res.json({
			success: false,
			error: "Failed to update address"
		})	
	});
});

router.post('/create', async function(req, res, next) {
	let addressInfo = req.body.address;
	let saveAsDefault = req.body.saveAsDefault;
	let now = new Date();
	let address = new Address({
		createdAt: now,
		updatedAt: now,
		isDefault: saveAsDefault,
		isShippingAddress: true,
		isActive: true,
		fullName: addressInfo.fullName,
		addressState: addressInfo.addressState,
		addressCity: addressInfo.adressCity,
		addressCountry: addressInfo.addressCountry,
		addressLine1: addressInfo.addressLine1,
		addressLine2: addressInfo.addressLine2,
		addressZip: addressInfo.addressZip,
		userId: req.body.userId
	});
	await address.save()
		.then((address) => {
			Address.populate(address, { path: 'userId'}).then((address) => {
				res.json({
					success: true,
					payload: address
				});
			})
		}).catch((error) => {
			res.json({
				success: false,
				error: 'Failed to create a new address.'
			})	
		})
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
	let address = await Address
		.findOne({_id: addressId})
		.then((address) => {
			if (!address) {
				res.json({
					success: false,
					error: "Couldn't find requested address id."
				});
				return;
			}
			address.isDefault = true;
			address.save()
				.then((address) => {
					Address.populate(address, { path: 'userId'}).then((address) => {
						res.json({
							success: true,
							payload: address
						});
					})
				})
				.catch((error) => {
					res.json({
						success: false,
						error: `Failed to save address as default: ${addressId}`
					});
				});
		})
		.catch((error) => {
			console.log(error);
			res.json({
				success: false,
				error: `Failed to set default for address: ${addressId}`
			})
		});
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
		.populate('userId')
		.then((address) => {
			res.json({
				success: true,
				address: address
			});
		})
		.catch((error) => {
			res.json({
				success: false,
				error: `Failed to fetch address for this userId: ${userId} or addressId: ${addressId}`
			});
		});

})

module.exports = router;