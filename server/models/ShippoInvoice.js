const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippoInvoiceSchema = new mongoose.Schema({
  ratesId: String,
  shipmentId: String,
  transactionId: String
}, {
  timestamps: true
})