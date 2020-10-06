const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	description: String,
});

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
module.exports = ProductVariant;
