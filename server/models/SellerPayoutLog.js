const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerPayoutLogSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  stripeUID: String,
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  payoutAmount: Number,
  stripePaymentId: Number,
  stripePayoutId: Number,
  stripeTransferId: Number,
  sellerPayout: Number,
  isApproved: Boolean,
  paidOutAt: Date
}, {timestamps: true});

const SellerPayoutLog = mongoose.model('SellerPayoutLog', SellerPayoutLogSchema);
module.exports = SellerPayoutLog;
