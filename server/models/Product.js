const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	description: String,
	handle: String,
	inventoryAvailableToSell: Number,
	inventoryInStock: Number,
	isBackorder: Boolean,
	isDeleted: Boolean,
	isLowQuantity: Boolean,
	isSoldOut: Boolean,
	isVisible: Boolean,
	metaDescription: String,
	metafields: Array,
	facebookShareMsg: String,
	pinterestShareMsg: String,
	twitterMsg: String,
	style: Array,
	light: String,
	color: Array,
	level: String,
	benefit: Array,
	imageURLs: Array,
	vendorId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	sku: String,
	weight: Number,
	height: Number,
	width: Number,
	light: String,	
	size: String,
	color: String,	
	style: String,
	price: {
		value: Number,
		currency: String
	},
	publishedAt: Date,
	tagIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductTag'
	}],
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	}
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
