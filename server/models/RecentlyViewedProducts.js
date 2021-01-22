const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const { getEnvVariable } = require("../utils/envWrapper");
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const recentlyViewedProduct = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}
});


const RecentlyViewedProduct = mongoose.model('RecentlyViewedProduct', recentlyViewedProduct);
module.exports = RecentlyViewedProduct;
