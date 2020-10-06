var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Store = require('../models/Store');
var ProductTag = require('../models/ProductTag');
var NavigationMenu = require('../models/NavigationMenu');
var NavigationItem = require('../models/NavigationItem');
const {sendEmail} = require("../email/emailClient");
const mongoose = require('mongoose');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('csvtojson');

router.get('/get', async function(req, res, next) {
	let handle = req.query.handle;
	let menu = await NavigationMenu
		.findOne({handle: handle});
	if (!menu) {
		res.json({
			success: false,
			error: "Menu doesn't exist."
		});
	} else {
		let menuItems = await NavigationItem.find({menuId: menu._id});
		return res.json({
			success: true,
			payload: {
				menu: menu,
				menuItems: menuItems
			}
		});
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