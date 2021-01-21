const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getEnvVariable } = require("../utils/envWrapper");
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const productSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	description: String,
	handle: String,
	inventoryAvailableToSell: Number,
	inventoryInStock: Number,
  inventorySold: Number,
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
  tagHandles: [String],  //for algolia
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
  plantId: {
    type: Schema.Types.ObjectId,
    ref: 'Plant'
  },
  searchMetaData: Object,
});

productSchema.post('updateOne', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_PRODUCT_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate({path: 'variationIds', populate:{path: 'optionIds'}})
    .populate('storeId')
    .populate('tagIds').execPopulate();
  let tagHandles = [];
  for (var i in this.tagIds) {
    tagHandles.push(this.tagIds[i].handle);
  }
  let object = docToUpdate;
  object.set('objectID', docToUpdate._id)
  object.set('tagHandles', tagHandles)
  // add to update query the tagHandles
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia: ", err)
    });
});

productSchema.post('findOneAndUpdate', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_PRODUCT_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate({path: 'variationIds', populate:{path: 'optionIds'}})
    .populate('storeId').populate('tagIds').execPopulate();
  let tagHandles = [];
  for (var i in docToUpdate.tagIds) {
    tagHandles.push(docToUpdate.tagIds[i].handle);
  }
  let object = docToUpdate;
  object.set('objectID', docToUpdate._id)
  object.set('tagHandles', tagHandles)
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia: ", err)
    });
});

productSchema.pre('save', async function(next) {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_PRODUCT_INDEX'));
  await this
    .populate({path: 'variationIds', populate:{path: 'optionIds'}})
    .populate('storeId')
    .populate('tagIds').execPopulate();
  let tagHandles = [];
  for (var i in this.tagIds) {
    tagHandles.push(this.tagIds[i].handle);
  }
  let object = this;
  object.set('objectID', this._id)
  object.set('tagHandles', tagHandles)
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      console.log("error updating to algolia: ", err)
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
