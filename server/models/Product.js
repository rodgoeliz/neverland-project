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
	lightLevel: String,
	colors: Array,
	userLevel: String,
	benefit: Array,
	imageURLs: Array,
	vendorId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	sku: String,
	originZipCode: String,
	handlingFee: String,
	offerFreeShipping: Boolean,
	weightLb: Number,
	weightOz: Number,
	heightIn: Number,
	widthIn: Number,
	lengthIn: Number,
  sku: String,
	size: String,
	isOrganic: Boolean,
	isArtificial: Boolean,
  processingTime: String,
	variationIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductVariation'	
	}],
	price: {
		value: Number,
		currency: String
	},
	publishedAt: Date,
  categoryIds: [{
    type: Schema.Types.ObjectId,
    ref: 'NavigationItem'
  }],
	tagIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductTag'
	}],
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	}
});

productSchema.post('find', function(next) {
  console.log('find hook')
  this.populate({path: 'variationIds', populate: {path: 'optionIds'}});
  this.populate('tagIds');
  this.populate('storeId');
});

productSchema.pre('remove', function (next) {
  this.model('RecentlyViewedProduct').remove({productId: this._id}, next);
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
