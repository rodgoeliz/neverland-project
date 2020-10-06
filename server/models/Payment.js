const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	address: {
		type: Schema.Types.ObjectId,
		ref: 'UserAddress'
	},
	captureErrorCode: String,
	captureErrorMessage: String,
	displayName: String,
	isDefault: Boolean,
	method: String,
	paymentPluginName: String,
	processor: String,
	riskLevel: String,
	storeId: String,
	status: String,
	transactionId: String,
	transactons: Array
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
