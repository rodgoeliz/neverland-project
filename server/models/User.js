const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	username: String,
	email: String,
	firebaseUID: String,
	stripeCustomerID: String,
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

// add password comparison and passport auth
userSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
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
