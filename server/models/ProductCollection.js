const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const productCollectionsSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
	productIds: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}
}, {timestamps: true});

const ProductCollection = mongoose.model('ProductCollection', productCollectionsSchema);
module.exports = ProductCollection;
