const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isActive: Boolean,
	handle: String,
	coupon: {
		value: Number,
		type: String // percent or dollar amount
	},
	expirationDate: Date,
	usageLimit: Number, // how many times this can be used
	isUnlimited: Boolean // if this is an unlimited coupon
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
