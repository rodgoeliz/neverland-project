const mongoose = require('mongoose');
const Schema = mongoose. Schema;

const productSearchMetaData = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  type: String,
  title: String,
  handle: String,
  metaData: Object
});

const metaData = mongoose.model('ProductSearchMetaData', productSearchMetaData);
module.exports = metaData;