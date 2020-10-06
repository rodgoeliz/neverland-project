var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var Coupon = require('../models/Coupon');

/*
  Creates a new bundle or adds to an existing bundle.
  Returns a populated bundle w/ store and user
  */
router.post('/add', async function(req, res, next) {
	let handle = req.body.handle;
	let coupon = req.body.coupon;
	let expirationDate = req.body.expirationDate;
	let isUnlimited = req.body.isUnlimited;
	let usageLimit = req.body.usageLimit;

	let newCoupon = new Coupon({
		handle,
		coupon,
		expirationDate,
		isUnlimited,
		usageLimit,
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date()
	})
	newCoupon.save()
	.then((coupon) => {
		res.json({
			success: true,
			payload: coupon
		})
	})
	.catch((error) => {
		res.json({
			success: false,
			error: "Failed to create the coupon."
		});
	})
});

/**
Deleted a product from an existing bundle
**/
router.post('/delete', async function(req, res, next) {
	let couponId = req.body.couponId;
	await Coupon.deleteOne({_id: couponId})
		.then(() => {
			res.json({
				success: true
			});
		})
		.catch((error) => {
			res.json({
				success: false,
				error: "Failed to delete coupon: " + couponId
			});
		})
});

router.post('/deactivate', async function(req, res, next) {
	let couponId = req.body.couponId;
	let coupon = await Coupon.find({_id: couponId});
	if (!coupon) {
		res.json({
			success: false,
			error: "Failed to find coupon with id: " + couponId
		});
	}
	coupon.isActive = false;
	coupon.save()
		.then((coupon) => {
			res.json({
				success: true,
				payload: coupon
			});
		})
		.catch((error) => {
			res.json({
				success: false,
				error: "Failed to deactive coupon."
			})
		});
});

router.post('/activate', async function(req, res, next) {
	let couponId = req.body.couponId;
	let coupon = await Coupon.find({_id: couponId});
	if (!coupon) {
		res.json({
			success: false,
			error: "Failed to find coupon with id: " + couponId
		});
	}
	coupon.isActive = true;
	coupon.save()
		.then((coupon) => {
			res.json({
				success: true,
				payload: coupon
			});
		})
		.catch((error) => {
			res.json({
				success: false,
				error: "Failed to activate coupon."
			})
		});
});

module.exports = router;