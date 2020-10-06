const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bundleSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isInternal: Boolean,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
	productIds: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	]
});

const Bundle = mongoose.model('Bundle', bundleSchema);
module.exports = Bundle;
