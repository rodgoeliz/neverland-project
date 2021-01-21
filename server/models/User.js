const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;
const { getEnvVariable } = require("../utils/envWrapper");
const Logger = require('../utils/errorLogger');
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const userSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	username: String,
	email: String,
  objectID: String, // algolia
	firebaseUID: String,
	stripeCustomerID: String,
  sendBirdUserID: String,
  sendBirdChannelURL: String,
	password: String,
	facebookId: String,
  avatarURL: String,
	defaultLogin: String,
	name: String,
	onboardingStepId: String,
	zipCode: String,
	phoneNumber: {
		number: String,
		countryCode: String
	},
  userInterestTags: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductTag'
  }],
	phoneNumberDetailed: Object,
	locations: Array,
	plantInterests: Array,
	level: String,
	plantRequirements: Array,
	isProfileComplete: Boolean,
	isSeller: Boolean,
  isAdmin: Boolean,
	sellerProfile: {
		type: Schema.Types.ObjectId,
		ref: 'SellerProfile'
	},
	storeId: {
		type: Schema.Types.ObjectId, 
		ref: 'Store'
	},
});

userSchema.post('updateOne', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_USER_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('storeId')
    .populate('userInterestTags')
    .populate('sellerProfile')
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

userSchema.post('findOneAndUpdate', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_USER_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('storeId')
    .populate('userInterestTags')
    .populate('sellerProfile')
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
userSchema.pre('save', async function ( next ) {
  const index = client.initIndex(getEnvVariable('ALGOLIA_USER_INDEX'));
  await this
    .populate('storeId')
    .populate('userInterestTags')
    .populate('sellerProfile')
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

userSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.password;
	return obj;
}

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
}

userSchema.methods.compareAuthTokens = function(candidateToken, cb) {
	return this.authToken == candidateToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
