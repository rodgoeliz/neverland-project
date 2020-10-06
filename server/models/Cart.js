const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	isActive: Boolean,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	productIds: [{
		type: Schema.Types.ObjectId,
		ref: 'NavigationItem'
	}],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
