const mongoose = require('mongoose');

const orderFulfillmentItemSchema= new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	anonymousAccessToken: String,
	billingAddress: String,
	shippingAddress: String,
	orderId: {
		type: Schema.Types.ObjectId,
		ref: 'Order'
	},
	tracking: String,
	trackingUrl: String,
	fulfillmentType: String,
	storeId: {
		type: Schema.Types.ObjectId,
		ref: 'Store'
	}
});

const OrderFulfillmentItem = mongoose.model('OrderFulfillmentItem', orderFulfillmentItemSchema);
module.exports = OrderFulfillmentItem;
