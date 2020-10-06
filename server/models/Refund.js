const mongoose = require('mongoose');

const refundSchema= new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
	amount: Number,
});

const Refund = mongoose.model('Refund', refundSchema);
module.exports = Refund;
