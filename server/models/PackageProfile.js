const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageProfileSchema = new mongoose.Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    r4ef: 'Store'
  },
  type: String,
  title: String,
  length: Number,
  height: Number,
  width: Number,
  packageFee: Number
}, {
  timestamps: true
});

const PackageProfile = mongoose.model('PackageProfile', packageProfileSchema);
module.exports = PackageProfile;