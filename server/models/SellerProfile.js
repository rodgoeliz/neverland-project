const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const sellerProfileSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	sellerInterestReason: String,
	sellerReferralSource: String,
	sellerChallenge: String,
	stripeUID: String,
	productCategoriesSold: [String],
	storesSellerSellsAt: [String],
  buyerSurchage: Number,
	productSource: String,
	packingDetails: String,
	personalAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	businessAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	statesCanNotShipTo: [String],
	birthday: Date,
	phoneNumber: {
		number: String,
		countryCode: String
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	storeId: {
		type: Schema.Types.ObjectId, 
		ref: 'Store'
	},
});


const SellerProfile = mongoose.model('SellerProfile', sellerProfileSchema);
module.exports = SellerProfile;
