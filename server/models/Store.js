const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getEnvVariable } = require("../utils/envWrapper");
const Logger = require('../utils/errorLogger');
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const storeSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isActive: Boolean,
	handle: String,
	deActivatedAt: Date,
	activatedAt: Date,
	title: String,
	website: String,
	instagram: String,
	facebook: String,
	description: String,
	businessAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
  packageProfileIds: [{
    type: Schema.Types.ObjectId,
    ref: 'PackageProfile'
  }],
	categoryTagIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductTag'
	}],
	address: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	productIds: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	collectionIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductCollection'
	}],
	userId: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
}, {timestamps: true});

storeSchema.post('updateOne', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_STORE_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('businessAddress')
    .populate('packageProfileIds')
    .populate('categoryTagIds')
    .populate('address')
    .populate('userId')
    .execPopulate();
  docToUpdate.set('objectID', docToUpdate._id);
  // add to update query the tagHandles
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia order index: ", err)
    });
});

storeSchema.post('findOneAndUpdate', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_STORE_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('businessAddress')
    .populate('packageProfileIds')
    .populate('categoryTagIds')
    .populate('address')
    .populate('userId')
    .execPopulate();
  docToUpdate.set('objectID', docToUpdate._id);
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia: ", err)
      Logger.logError(err);
    });
});

// add password comparison and passport auth
storeSchema.pre('save', async function(next) {
  const index = client.initIndex(getEnvVariable('ALGOLIA_STORE_INDEX'));
  await this
    .populate('businessAddress')
    .populate('packageProfileIds')
    .populate('categoryTagIds')
    .populate('address')
    .populate('userId')
    .execPopulate();
  let object = this;
  object.set('objectID', this._id)
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      console.log("error updating to algolia: ", err)
      Logger.logError(err);
    });
});
const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
