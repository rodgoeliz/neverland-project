var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var Bundle = require('../models/Bundle');

router.get('/get/all', async function(req, res, next) {
	let userId = req.query.userId;
	if (!userId) {
		res.json({success: false, error: "Not logged in. Please authenticate."})
	}

	let bundles = await Bundle.find({userId});
	if (bundles) {
		res.json({
			success: true,
			payload: bundles
		});
	}
});
/*
  Creates a new bundle or adds to an existing bundle.
  Returns a populated bundle w/ store and user
  */
router.post('/add', async function(req, res, next) {
	let userId = req.body.userId;
	let storeId = req.body.storeId;
	let productId = req.body.productId;
	let now = new Date();
	// see if there's existing bundle
	let bundle = await Bundle.findOne({userId, storeId});
	if (bundle) {
		let alreadyExistsProduct = false;
		for (var i in bundle.productIds) {
			let existingProductId = bundle.productIds[i];
			if (existingProductId == productId) {
				alreadyExistsProduct = true;
			}
		}
		if (!alreadyExistsProduct) {
			bundle.productIds.push(productId);
		}
	} else {
		bundle = new Bundle({
			createdAt: now,
			updatedAt: now,
			userId,
			storeId,
			productId	
		});
	}

	await bundle.save()
		.then((bundle) => {
			Bundle.populate(bundle, {path: 'storeId'})
				.then((bundle) => {
					Bundle.populate(bundle, {path: 'userId'}).then((bundle) => {
						res.json({
							success: true,
							payload: bundle
						});

					})
				});
		}).catch((error) => {
			console.log(error)
			res.json({
				success: false,
				error: "Failed to create bundle."
			});
		})
});

/**
Deleted a product from an existing bundle
**/
router.post('/delete', async function(req, res, next) {
	let userId = req.body.userId;
	let storeId = req.body.storeId;
	let productId = req.body.productId;
	let bundleId = req.body.bundleId;
	let query = {_id: bundleId};
	if (!bundleId && userId && storeId) {
		query = {userId, storeId};
	}
	let bundle = await Bundle.findOne(query);
	if (!bundle) {
		res.json({
			success: false,
			error: "Failed to find bundle for id: " + bundleId
		});
	} else {
		let indexOfItem = bundle.productIds.indexOf(productId);
		if (indexOfItem >= 0) {
			bundle.productIds.splice(indexOfItem, 1);
		}
		bundle.save()
			.then((bundle) => {
				res.json({
					success: true,
					payload: bundle
				});
		});
	}
});

module.exports = router;