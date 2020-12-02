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
  objectID: String,
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

productSchema.post('updateOne', async function() {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.populate('storeId');
  docToUpdate.objectID = docToUpdate._id;
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
    });
});

productSchema.post('findOneAndUpdate', async function() {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.populate('storeId');
  docToUpdate.objectID = docToUpdate._id;
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      console.log("OBJECTIDS", objectIDs)
    }).catch(err => {
      // log error
    });
});

productSchema.post('save', async function(next) {
  //sync up with algolia
  const algoliasearch = require("algoliasearch");
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("dev_neverland_products");
  let object = this;
  object.set('objectID', this._id)
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      //res.json({success: true});
      console.log(objectIDs)
    }).catch(err => {
      console.log(err)
      //res.json({success: false});
    });
});

productSchema.post('find', async function(result) {
  this.populate({path: 'variationIds', populate: {path: 'optionIds'}});
  this.populate('tagIds');
  this.populate('storeId');
});

productSchema.pre('remove', async function (next) {
  this.model('RecentlyViewedProduct').remove({productId: this._id}, next);
  // TODO: remove product variation and variation options
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
