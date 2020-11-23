var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var Bundle = require('../models/Bundle');

router.get('/get', async function(req, res, next) {
  let bundleId = req.query.id;
  let lite = req.query.lite;
  if (!bundleId) {
    res.json({success: false, error: "Please include bundle id."});
  }
  try {
    const bundle = await Bundle.findOne({_id: bundleId}).populate('storeId').populate('productIds');
    let transformedBundle = bundle;
    if (lite) {
      transformedBundle = {
        _id: bundle._id,
        storeId: {
          title: bundle.storeId.title
        },
        productIds: bundle.productIds
      }
    }
    res.json({
      success: true,
      payload: bundle
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.get('/get/list', async function(req, res, next) {
	let userId = req.query.userId;
  let lite = req.query.lite;
	if (!userId) {
		res.json({success: false, error: "Not logged in. Please authenticate."})
	}

	const bundles = await Bundle.find({userId}).populate('storeId').populate('productIds');
  let transformedBundles = bundles;
  if (lite) {
    for (var i = 0; i < bundles.length; i++) {
      let bundle = bundles[i];
      transformedBundles.push({
        _id: bundle._id,
        storeId: {
          title: bundle.storeId.title
        },
        productIds: bundle.productIds
      });
    }
  }
	if (transformedBundles) {
		res.json({
			success: true,
			payload: transformedBundles
		});
	} else {
    res.json({
      success: false,
      error: "Failed to load bundles."
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