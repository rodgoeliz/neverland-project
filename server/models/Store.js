const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isActive: Boolean,
	handle: String,
	deActivatedAt: Date,
	activatedAt: Date,
	title: String,
	website: String,
	instagram: String,
	facebook: String,
	description: String,
	businessAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	categoryTagIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductTag'
	}],
	address: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	productIds: [{
		type: Schema.Types.ObjectId,
		ref: 'Product'
	}],
	collectionIds: [{
		type: Schema.Types.ObjectId,
		ref: 'ProductCollection'
	}],
	userId: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
