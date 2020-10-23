var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require('mongoose');
var Bundle = require('../models/Bundle');
var PaymentMethod = require('../models/PaymentMethod');
var Card = require('../models/Card');
var Address = require('../models/Address');
var User = require('../models/User');
var Store = require('../models/Store');
var OrderInvoice = require('../models/OrderInvoice');
var OrderIntent = require('../models/OrderIntent');
var Order = require('../models/Order');
const { getBuyerProtectionSurcharge, calculateBundleSubTotal, getFulfillmentMethod, calculateTaxSurcharge } = require("../utils/orderProcessor");

router.get('/get', async function(req, res) {

});

router.post('/intent/create', async function(req, res) {
  let productId = req.body.productId;
  let bundleId = req.body.bundleId;
  let userId = req.body.userId;
  let storeId = req.body.storeId;
  let shippingAddressId = req.body.shippingAddressId;
  let paymentMethodId = req.body.paymentMethodId;
  let now = new Date();
  if (productId && !bundleId)  {
    newBundle = new Bundle({
      isInternal: true,
      createdAt: now,
      updatedAt: now,
      userId: userId,
      storeId: storeId,
      productIds: [productId]
    });
    bundle = await newBundle.save();
    bundleId = bundle._id;
  }


  let loadAllPromises = [];
  let shippingAddress = await Address.findOne({_id: shippingAddressId});
  let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId}).populate('card').populate('billingAddress');
  let user = await User.findOne({_id: userId});
  let store = await Store.findOne({_id: storeId}).populate('store');
  loadAllPromises.push(shippingAddress);
  loadAllPromises.push(paymentMethod);
  loadAllPromises.push(user);
  loadAllPromises.push(store);
  // if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
  // wrap around product
  loadAllPromises.push(await Bundle.findOne({_id: bundleId}).populate('productIds'))
  Promise.all(loadAllPromises).then(async (results) => {
    let shippingAddress = results[0];
    let paymentMethod = results[1];
    let user = results[2];
    let store = results[3];
    let bundle = results[4];
    let subtotal = await calculateBundleSubTotal(bundle);
    subtotal = subtotal/100;
    let buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
    let shippingMethod = await getFulfillmentMethod("usps", "priority");
    let shippingCharge = shippingMethod.price;
    let taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
    let total = subtotal + buyerSurcharge + shippingCharge;
    let surcharge = buyerSurcharge + shippingCharge;

    let newOrderObject = new OrderIntent({
      createdAt: now,
      updatedAt: now,
      userId: userId,
      billingAddress: paymentMethod.billingAddress._id,
      storeId: storeId,
      price: {
        value: subtotal,
        currency: 'USD' 
      },
      storeId: storeId,
      vendorId: store.userId,
      effectiveTaxRate: taxSurcharge.rate,
      surcharges: surcharge,
      buyerSurcharge: Math.round(buyerSurcharge * 100),
      subtotal: subtotal,
      shipping: shippingCharge,
      taxes: taxSurcharge.taxAmoun,
      taxableAmount: taxSurcharge.taxableAmount,
      total: total
    });
    let newOrder = await newOrderObject.save();
    res.json({
      success: true,
      payload: newOrder
    })

  });
});

router.post('/create', async function(req, res) {
	let productId = req.body.productId;
	let bundleId = req.body.bundleId;
	let userId = req.body.userId;
	let storeId = req.body.storeId;
	let shippingAddressId = req.body.shippingAddressId;
	let paymentMethodId = req.body.paymentMethodId;
	let now = new Date();
	let bundle = null;
	//if productId only and not a bundle, create a bundle wrapping that product.
	if (productId && !bundleId)	 {
		newBundle = new Bundle({
			isInternal: true,
			createdAt: now,
			updatedAt: now,
			userId: userId,
			storeId: storeId,
			productIds: [productId]
		});
		bundle = await newBundle.save();
		bundleId = bundle._id;
	}
	// Load shipping address, payment method, user, paymentMethod
	let loadAllPromises = [];
	let shippingAddress = await Address.findOne({_id: shippingAddressId});
	let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId}).populate('card').populate('billingAddress');
	let user = await User.findOne({_id: userId});
	let store = await Store.findOne({_id: storeId}).populate('store');
	loadAllPromises.push(shippingAddress);
	loadAllPromises.push(paymentMethod);
	loadAllPromises.push(user);
	loadAllPromises.push(store);
	// if bundle is null, meaning we didn't load bundleId and we didn't have to create a bundle to 
	// wrap around product
	loadAllPromises.push(await Bundle.findOne({_id: bundleId}).populate('productIds'))
	Promise.all(loadAllPromises).then(async (results) => {
		let shippingAddress = results[0];
		let paymentMethod = results[1];
		let user = results[2];
		let store = results[3];
		let	bundle = results[4];
		let subtotal = await calculateBundleSubTotal(bundle);
		let buyerSurcharge = await getBuyerProtectionSurcharge(subtotal)
		let shippingMethod = await getFulfillmentMethod("usps", "priority");
		let shippingCharge = shippingMethod.price;
		let taxSurcharge = await calculateTaxSurcharge(subtotal, shippingAddress, shippingCharge, store.address);
		let total = subtotal + buyerSurcharge + taxSurcharge.taxAmount + shippingCharge;
		let surcharge = buyerSurcharge + taxSurcharge.taxAmount + shippingCharge;
		// create payment
		let newOrderInvoice = new OrderInvoice({
			createdAt: now,
			updatedAt: now,
			bundleId: bundle._id,
			price: {
				value: subtotal,
				currency: 'USD'	
			},
			effectiveTaxRate: taxSurcharge.rate,
			surcharges: surcharge,
			subtotal: subtotal,
			shipping: shippingCharge,
			taxes: taxSurcharge.taxAmoun,
			taxableAmount: taxSurcharge.taxableAmount,
			total: total
		});
		let orderInvoice = await newOrderInvoice.save();
		let newOrderObject = new Order({
			createdAt: now,
			updatedAt: now,
			userId: userId,
			billingAddress: paymentMethod.billingAddress._id,
			storeId: storeId,
			orderInvoiceId: orderInvoice
		});
		let newOrder = await newOrderObject.save();
		// stripe create a new  connect payment
		res.json({
			success: true,
			payload: newOrder
		})
		//process payment
	});
});

router.post('/delete', async function(req, res) {

});

router.post('/update', async function(req, res) {

});

router.post('/updateTracking', async function(req, res) {

});

module.exports = router;