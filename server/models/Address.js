const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isActive: Boolean,
	isDefault: Boolean,
	isBillingAddress: Boolean,
	isShippingAddress: Boolean,
	fullName: String,
	addressCity: String,
	addressState: String,
	addressCountry: String,
	addressCounty: String,
	addressLine1: String,
	addressLine2: String,
	addressZip: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
