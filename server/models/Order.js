const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getEnvVariable } = require("../utils/envWrapper");
const Logger = require('../utils/errorLogger');
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const orderSchema = new mongoose.Schema({
	anonymousAccessToken: String,
  sellerPayout: Number,
	billingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  shippingAddressId: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
	userId: {
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
	orderInvoiceId: {
		type: Schema.Types.ObjectId,
		ref: 'OrderInvoice'
	},
  trackingInfo: {
    trackingId: String, 
    carrier: String,
  },
  status: {
    type:String, // need-to-fulfill, shipped, delivered, paid-out
    enum: ['need-to-fulfill', 'shipped', 'delivered', 'paid-out'],
    default: 'need-to-fulfill'
  },
  deliveredAt: Date,
  paidOutAt: Date
}, {timestamps: true});


orderSchema.post('updateOne', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_ORDER_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('userId')
    .populate('orderInvoiceId')
    .populate({path: 'paymentMethod', populate: 'billingAddress'})
    .populate('shippingAddressId')
    .execPopulate();
  docToUpdate.set('objectID', docToUpdate._id);
  // add to update query the tagHandles
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia order index: ", err)
    });
});

orderSchema.post('findOneAndUpdate', async function() {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_ORDER_INDEX'));
  const docToUpdate = await this.model.findOne(this.getQuery());
  await docToUpdate
    .populate('userId')
    .populate('orderInvoiceId')
    .populate({path: 'paymentMethod', populate: 'billingAddress'})
    .populate('shippingAddressId')
    .execPopulate();
  docToUpdate.set('objectID', docToUpdate._id);
  index.saveObjects([docToUpdate], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      // log error
      console.log("error updating to algolia: ", err)
      Logger.logError(err);
    });
});

orderSchema.pre('save', async function(next) {
  //sync up with algolia
  const index = client.initIndex(getEnvVariable('ALGOLIA_ORDER_INDEX'));
  await this
    .populate('userId')
    .populate('orderInvoiceId')
    .populate({path: 'paymentMethod', populate: 'billingAddress'})
    .populate('shippingAddressId')
    .execPopulate();
  let object = this;
  object.set('objectID', this._id)
  index.saveObjects([this], {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
    }).catch(err => {
      console.log("error updating to algolia: ", err)
      Logger.logError(err);
    });
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
