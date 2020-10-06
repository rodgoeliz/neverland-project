var express = require("express");
require('dotenv').config();
var router = express.Router();
var PaymentMethod = require('../models/PaymentMethod');
var Address = require('../models/Address');
var Order = require('../models/Order');
var NavigationMenu = require('../models/NavigationMenu');
var NavigationItem = require('../models/NavigationItem');
const mongoose = require('mongoose');

/**
 Load navigation, default payment method, default billing address, default shipping address
 **/
router.get('/init', async function(req, res, next) {
	console.log("init app")

	let userId = req.query.userId;
	let menuHandle = req.query.menuHandle;
	let allInitPromises = [];
	console.log("init app for")
	console.log(userId)
	let menu = await NavigationMenu
		.findOne({handle: menuHandle})
		.then(async (menu) => {
			let menuItems = await NavigationItem.find({menuId: menu._id});
			return {
				menu: menu,
				menuItems: menuItems
			};
		});
	allInitPromises.push(menu);

	// Find default payment method for user
	let paymentMethod = await PaymentMethod.findOne({
		userId,
		isDefault: true,
		isActive: true
	}).populate('card').populate('billingAddress');
	allInitPromises.push(paymentMethod);

	// Find default shipping address
	let shippingAddress = await Address.findOne({
		isDefault: true,
		userId: userId,
		isShippingAddress: true,
		isActive: true
	});
	allInitPromises.push(shippingAddress);

	// find all shipping addresses
	let allShippingAddresses = await Address.find({
		isActive: true,
		isShippingAddress: true,
		userId: userId
	});
	allInitPromises.push(allShippingAddresses);

	// find all payment methods
	let allPaymentMethods = await PaymentMethod.find({
		isActive: true,
		userId
	}).populate('card').populate('billingAddress');
	allInitPromises.push(allPaymentMethods);

	// get user orders
	let allOrders = await Order.find({
		userId
	}).populate('storeId').populate('orderInvoiceId').populate('bundleId');
	allInitPromises.push(allOrders);

	Promise.all(allInitPromises).then((results) => {
		// parse results and return to client
		let navigationMenu = results[0];
		let paymentMethod = results[1];
		let shippingAddress = results[2];
		let allShippingAddresses = results[3];
		let allPaymentMethods = results[4];
		let allOrders = results[5];
		console.log("Orders")
		console.log(allOrders)
		res.json({
			success: true,
			payload: {
				navigationMenu: navigationMenu,
				shippingAddress: shippingAddress,
				paymentMethod: paymentMethod,
				allShippingAddresses: allShippingAddresses,
				allPaymentMethods: allPaymentMethods,
				allOrders: allOrders
			}
		})
	});
});

module.exports = router;