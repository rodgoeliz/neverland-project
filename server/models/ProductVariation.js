const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productVariationSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	handle: String,
	isPriceVaried: Boolean,
	isSKUVaried: Boolean,
	isVisible: Boolean,
	isQuantityVaried: Boolean,
	optionIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductVariationOption'
	}]
});

const ProductVariation = mongoose.model('ProductVariation', productVariationSchema);
module.exports = ProductVariation;
