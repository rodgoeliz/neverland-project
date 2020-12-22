const mongoose = require('mongoose');
const waitlistUserSchema = new mongoose.Schema({
	createdAt: Date,
	email: String,
	referralCode: String,
	position: Number,
	inviter: String
}, {
  timestamps: true
});
waitlistUserSchema.pre('create', function(next) {
	this.referralCode = "" + Math.rand(10,10000);
});
const WaitlistUser = mongoose.model('WaitlistUser', waitlistUserSchema);
module.exports = WaitlistUser;
