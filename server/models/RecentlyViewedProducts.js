const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

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
