const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const favoriteProduct = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const FavoriteProduct = mongoose.model('FavoriteProduct', favoriteProduct);
module.exports = FavoriteProduct;
