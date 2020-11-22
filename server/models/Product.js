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
	price: { // lowest priced variation
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

productSchema.pre('updateOne', function(next) {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  console.log("SAVING OBJECT ID: ", this._id)
  console.log(this)
  this.objectID = this._id;
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      next();
    }).catch(err => {
    });
});

productSchema.pre('findOneAndUpdate', function(next) {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  this.objectID = this._id;
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      next();
    }).catch(err => {
      // log error
    });
});

productSchema.pre('save', function(next) {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  console.log("SAVING OBJECT ID: ", this._id)
  console.log(this)
  this.objectID = this._id;
  console.log(this.objectID)
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      console.log("Saved objects")
      //res.json({success: true});
      next();
    }).catch(err => {
      console.log(err)
      //res.json({success: false});
    });
});

productSchema.post('find', function(next) {
  this.populate({path: 'variationIds', populate: {path: 'optionIds'}});
  this.populate('tagIds');
  this.populate('storeId');
  next();
});

productSchema.pre('remove', function (next) {
  this.model('RecentlyViewedProduct').remove({productId: this._id}, next);
  // TODO: remove product variation and variation options
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
