const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderProductItem = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  selectedOptionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductVariationOption'
  }]
});

orderProductItem.pre('save', function(next) {
  this.createdAt = new Date();
  this.updatedAt = new Date(); 
  next();
})

const OrderProductItem = mongoose.model('OrderProductItem', orderProductItem);
module.exports = OrderProductItem;
