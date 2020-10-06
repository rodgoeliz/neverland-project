const mongoose = require('mongoose');

const productCollectionsSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
	productIds: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}
});

const ProductCollection = mongoose.model('ProductCollection', productSchema);
module.exports = ProductCollection;
