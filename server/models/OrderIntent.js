const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderIntentSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  billingAddress: String,
  shippingAddressId: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  bundleId: {
    type: Schema.Types.ObjectId,
    ref: 'Bundle'
  },
  price: {
    value: Number,
    currency: String
  },
  effectiveTaxRate: Number,
  surcharges: Number,
  shipping: Number,
  subtotal: Number,
  taxes: Number,
  buyerSurcharge: Number,
  taxableAmount: Number,
  total: Number
});

const OrderIntent = mongoose.model('OrderIntent', orderIntentSchema);
module.exports = OrderIntent;
