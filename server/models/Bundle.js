const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bundleSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isInternal: Boolean,
  variationOptionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductVariationOption'
  }],
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
  productOrderItemIds: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderProductItem'
  }],
	productIds: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	]
});

const Bundle = mongoose.model('Bundle', bundleSchema);
module.exports = Bundle;
