var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var Bundle = require('../models/Bundle');
var OrderProductItem = require('../models/OrderProductItem');

router.post('/product/remove', async function(req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let bundleId = req.body.bundleId;
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

  res.json({
    success: true,
    payload: bundle
  });
});

router.post('/quantity/update', async function(req, res) {
  let productOrderItemId = req.body.productOrderItemId;
  let bundleId = req.body.bundleId;
  let amount = req.body.amount;
  let item = await OrderProductItem.findOne({_id: productOrderItemId});
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
  let updatedBundle = await Bundle.findOne({_id: bundleId}).populate('productOrderItemIds')
  res.json({
    success: true,
    payload: {
      product: product,
      bundle: updatedBundle 
  }});
});

router.get('/get', async function(req, res, next) {
  let bundleId = req.query.id;
  let lite = req.query.lite;
  if (!bundleId) {
    res.json({success: false, error: "Please include bundle id."});
  }
  try {
    const bundle = await Bundle.findOne({_id: bundleId})
      .populate('storeId')
      .populate({
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
        }]})
      .populate({
        path: 'productIds',
        populate: {
          path: 'variationIds',
          populate: {
            path: 'optionIds'
          }
        }});
    console.log("POUPLATEED BUNDLE", bundle)
    let transformedBundle = bundle;
    if (lite) {
      transformedBundle = {
        _id: bundle._id,
        storeId: {
          title: bundle.storeId.title,
          _id: bundle.storeId._id
        },
        productOrderItemIds: bundle.productOrderItemIds
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
	const bundles = await Bundle
      .find({userId, showInMyBundles: true})
      .populate('storeId')
      .populate({
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
        }]})
      .populate({
        path: 'productIds',
        populate: {
          path: 'variationIds',
          populate: {
            path: 'optionIds'
          }
        }});
  let transformedBundles = Array.from(bundles);
  console.log("Get list of bundles", bundles)
  if (lite) {
    transformedBundles = [];
    for (var i in bundles) {
      //console.log("Bundles iterate")

      let bundle = bundles[i];
      let storeTitle = bundle.storeId ? bundle.storeId.title : null;
      let storeId = bundle.storeId ? bundle.storeId._id : null;
      transformedBundles.push({
        _id: bundle._id,
        storeId: {
          title: storeTitle,
          _id: storeId 
        },
        productOrderItemIds: bundle.productOrderItemIds
      });
    }
  }
	if (transformedBundles) {
		res.json({
			success: true,
			payload: transformedBundles
		});
    return;
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
  this is ONLY FOR USER GENERATED BUNDLES, not CHECKOUT GENERATED BUNDLES
  */
router.post('/add', async function(req, res, next) {
	let userId = req.body.userId;
	let storeId = req.body.storeId;
	let productId = req.body.productId;
  let variationOptionIds = req.body.optionIds;
  let quantity = req.body.quantity;
	let now = new Date();
	// see if there's existing bundle
  let bundle = await Bundle.findOne({userId, storeId, showInMyBundles: true});
  let productOrderItem = null;
  let optionQuery = [];

  let orderItemQuery = [{productId}, {userId}, {storeId: storeId._id}];
  let oQuery = [];
  for (var i in variationOptionIds) {
    oQuery.push(variationOptionIds[i]);
  }
  if (oQuery.length > 0) {
    orderItemQuery.push({selectedOptionIds: {$all: oQuery}});
  }
  productOrderItem = await OrderProductItem.findOne({$and: orderItemQuery});
  let updateQuery = {};
  if (!productOrderItem) {
      updateQuery = {
        userId,
        productId,
        storeId,
        quantity,
        selectedOptionIds: variationOptionIds
      };
  } else {
    let productOrderQuantity = productOrderItem.quantity;
    if (!productOrderQuantity) {
      productOrderQuantity = 0; 
    }
    let newQuantity = productOrderQuantity + quantity;
    updateQuery = {
      quantity: newQuantity
    }
  }
    productOrderItem = await OrderProductItem
      .findOneAndUpdate(
        {$and: orderItemQuery}
        , {$set: updateQuery}, {new: true, upsert: true})
      .populate({
        path: 'productId', 
        populate: {
          path: 'variationIds',
          populate:   {
            path: 'optionIds' 
          }
        }
      })
      .populate('selectedOptionIds');
  
	if (bundle) {
    // check to see if the product already is in the bundle and if it is, increase the quantity of the productorderitem
    // check if selected options in there
    let productIds = bundle.productOrderItemIds;
    let alreadyExists = false;
    for (var i in productIds) {
      let productItemId = productIds[i];
      if (productItemId == productOrderItem._id.toString()) {
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      productIds.push(productOrderItem._id);
    }
    const updatedBundle = await Bundle.findOneAndUpdate(
      {userId, storeId}, 
      {$set: {productOrderItemIds: productIds, showInMyBundles: true}}, 
      {new: true})
      .populate({
          path: 'productOrderItemIds', 
          populate: [{
            path: 'productId'
          }, {
            path: 'selectedOptionIds'
          }]
      })
      .populate('variationOptionIds')
      .populate('storeId');
    res.json({
      success: true,
      payload: updatedBundle
    });
	 } else {
    //create new product order item

		let newBundleUpdate = {
			createdAt: now,
			updatedAt: now,
      variationOptionIds,
      showInMyBundles: true,
			userId,
			storeId,
      productOrderItemIds: [productOrderItem],
			productIds: [productId]
		};
    try {
    const updatedBundle = await Bundle.findOneAndUpdate(
        {userId, storeId}, 
        {$set: newBundleUpdate}, 
        {new: true, upsert: true})
      .populate({
          path: 'productOrderItemIds', 
          populate: [{
            path: 'productId'
          }, {
            path: 'selectedOptionIds'
          }]
      })
      .populate('variationOptionIds')
      .populate('storeId');
        res.json({
          success: true,
          payload: updatedBundle 
        });
    } catch (error) {
      res.json({
        success: false,
        error: error
      });
    }
	}
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