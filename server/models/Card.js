const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	address: {
		type: Schema.Types.ObjectId,
		ref: 'UserAddress'
	},
	type: String,
	name: String,
	cvc: String,
	zipCode: String,
	expMonth: Number,
	expYear: Number,
	country: String,
	funding: String,
	last4: String,
	type: String, // creditcard, venmo, paypal, apple pay	
	stripeId: String
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
