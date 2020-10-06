const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	anonymousAccessToken: String,
	billingAddress: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	paymentMethod: {
		type: Schema.Types.ObjectId,
		ref: 'PaymentMethod'
	},
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
	bundleId: {
		type: Schema.Types.ObjectId,
		ref: 'Bundle'
	},
	orderInvoiceId: {
		type: Schema.Types.ObjectId,
		ref: 'OrderInvoice'
	}
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
