const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const savedProductSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}
});

const SavedProduct = mongoose.model('SavedProduct', savedProductSchema);
module.exports = SavedProduct;
