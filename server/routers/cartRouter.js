var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Cart = require('../models/Cart');
const {sendEmail} = require("../email/emailClient");
const mongoose = require('mongoose');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('csvtojson');

router.get('/get', async function(req, res, next) {
	// create a cart or load existing cart
	let userId = req.query.userId;
	let cart = await Cart
		.findOne({isActive: true, userId: req.query.userId})
		.populate('productIds');
	if (!cart) {
		let newCart = new Cart({
			createdAt: new Date(),
			updatedAt: new Date,
			userId: userId
		});
		newCart
			.save()
			.then((cart)=> {
				res.json({
					success: true,
					cart: cart
				});
			})
			.error((error)=> {
				res.json({
					success:false,
					error: error
				});
			});
	} else {
		res.json({
			success: true,
			cart: cart
		})
	}
});

/** Route to upload json file of a navigation JSON */
router.post('/upload/file', async function(req, res, next) {
	let navigationJson = require('../data/navigation.json');
	let navMenu = await NavigationMenu.findOne({});

	let createChildrenNavItems = async function(navItems, parentId, menuId) {
		let allNavItemPromises = [];
		for (var i = 0; i < navItems.length; i++) {
			let navItem = navItems[i];
			let childNavId = mongoose.Types.ObjectId();
			let childNavItem = new NavigationItem({
				_id: childNavId,
				createdAt: new Date(),
				updatedAt: new Date(),
				title: navItem.title,
				handle: navItem.handle,
				parentId: parentId,
				menuId
			});
			let childrenNavItems = [];
			if (navItem.children && navItem.children.length > 0 ) {
				childrenNavItems = await createChildrenNavItems(navItem.children, childNavId, menuId);
			}
			childNavItem.children = childrenNavItems;
			// ush a promise to save
			allNavItemPromises.push(childNavItem.save())

		}
		return await Promise.all(allNavItemPromises);
	};
	if (!navMenu) {
		let navId = mongoose.Types.ObjectId();
		let newNavMenu = new NavigationMenu({
			_id: navId,
			createdAt: new Date(),
			updatedAt: new Date(),
			title: navigationJson.title,
			handle: navigationJson.handle,
			navigationItemsTopLevel: []
		});
		newNavMenu.save(async (err, menu) => {
			let navItemsToImport = navigationJson.navigationItemsTopLevel;
			let children = await createChildrenNavItems(navItemsToImport, null, navId);
			menu.navigationItemsTopLevel = children;
			menu.save((err, menu) => {
				res.json({status: 'success', menu: menu});
			});
		});
	} else {
		let navItemsToImport = navigationJson.navigationItemsTopLevel;
		let children = await createChildrenNavItems(navItemsToImport, null, navMenu._id);
		navMenu.navigationItemsTopLevel = children;
		navMenu.save((err, menu) => {
			res.json({status: 'success', menu: menu});
		});
	}
});

module.exports = router;