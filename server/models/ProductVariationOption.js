const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productVariationOptionSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	handle: String,
	sku: String,
	price: {
		value: String,
		currency: String
	},
	quantity: String
});

const ProductVariationOption = mongoose.model('ProductVariationOption', productVariationOptionSchema);
module.exports = ProductVariationOption;
