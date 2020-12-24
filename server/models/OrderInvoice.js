const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderInvoiceSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	bundleId: {
		type: Schema.Types.ObjectId,
		ref: 'Bundle'
	},
	price: {
		value: Number,
		currency: String
	},
	effectiveTaxRate: Number,
	surcharges: Number,
	shipping: Number,
	subtotal: Number,
	taxes: Number,
  sellerPayout: Number,
	taxableAmount: Number,
	total: Number
});

const OrderInvoice = mongoose.model('OrderInvoice', orderInvoiceSchema);
module.exports = OrderInvoice;
