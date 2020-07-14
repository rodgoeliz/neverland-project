const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
	createdAt: Date,
	email: String,
	password: String,
	facebookId: String,
	avatarURL: String,
	defaultLogin: String,
	name: String,
	zipCode: String,
	phoneNumber: String,
	locations: Array,
	plantInterests: Array,
	level: String,
	plantRequirements: Array

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

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
}

const User = mongoose.model('User', userSchema);
module.exports = User;
