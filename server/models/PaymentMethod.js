const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethodSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	type: String,
  stripeToken: Object,
  stripePaymentMethodId: String,
	address: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	card: {
		type: Schema.Types.ObjectId,
		ref: 'Card'
	},
	billingAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Address'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	paymentMethodId: String,		
	paymentMethodEmail: String,
	stripeId: String,
	isActive: Boolean,
	isDefault: Boolean
});
paymentMethodSchema.pre('remove', function(next) {
  let cardId = this.card;
  this.model('Card').remove({_id: cardId}, next);
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
module.exports = PaymentMethod;
