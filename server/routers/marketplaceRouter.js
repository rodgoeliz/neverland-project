var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var User = require('../models/User');
var SavedProducts = require('../models/SavedProducts');
var RecentlyViewedProducts = require('../models/RecentlyViewedProducts');
var NavigationMenu = require('../models/NavigationMenu');
var NavigationItem = require('../models/NavigationItem');
var ProductTag = require('../models/ProductTag');
var Product = require('../models/Product');
var Store = require('../models/Store');
var ProductCollection = require('../models/ProductCollection');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const CONTEXTUAL_SECTION_PRODUCT_LIMIT = 15;
router.get('/feed/home', async function(req, res, next) {
  try {

	let userId = req.query.userId;
	// if no userId, then go to login
	console.log("Get home feed", userId)
	console.log(req.query)
	console.log("-----")
	let user = null;
	try {
		user = await User.findOne({_id: userId});
	} catch (error)	 {
		console.log("get user error", error)
	}
	if (!user) {
		return;
	}

	let sections = [ ];
	let savedProducts = await SavedProducts.find({userId: userId}).limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
	if (savedProducts && savedProducts.length > 0) {
		//create a contextual section
		sections.push({
			type: 'savedProducts',
			items: savedProducts,
			title: 'Saved Products',
		});
	}

	let recentlyViewedProducts = await RecentlyViewedProducts.find({userId: userId}).populate('productId').limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
	let rvProducts = [];
	for (var idx in recentlyViewedProducts) {
		rvProducts.push(recentlyViewedProducts[idx].productId);
	}
	if (rvProducts && rvProducts.length > 0) {
		//create a contextual section	
		sections.push({
			type: 'recentlyViewedSection',
			items: rvProducts,
			title: 'Recently Viewed',
		});
	}
  let testproduct = await Product.find({}).limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
  let arvProducts = [];
  for (var idx in testproduct) {
    arvProducts.push(testproduct[idx]);
  }
  if (arvProducts && arvProducts.length > 0) {
    //create a contextual section 
    sections.push({
      type: 'recentlyViewedSection',
      items: arvProducts,
      title: 'Popular in your area',
    });
  }
	let navigationMenu = await NavigationMenu.findOne({handle: 'main_menu'}).populate({path: 'navigationItemsTopLevel', populate: { path: 'children'}});
	let navigationSections = [];
	// navigation sections with children is an array of arrays
	let navigationSectionsWithChildren = {};
	if (navigationMenu) {
		for (var key in navigationMenu.navigationItemsTopLevel)	{
			let navItem = navigationMenu.navigationItemsTopLevel[key];
			navigationSections.push(navItem);
			if (navItem.children && navItem.children.length > 0) {
				let subNavSection =[]
				for (var key in navItem.children)	 {
					subNavSection.push(navItem.children[key]);
				}
				navigationSectionsWithChildren[navItem.title] = {
					_id: navItem._id,
					items: subNavSection
				};
			}
		}
	}
	sections.push({
		type: 'navigationMainSection',
		items: navigationSections,
		title: "Marketplace",
		typeId: navigationMenu._id
	});

	for (var idx in navigationSectionsWithChildren) {
		let childSectionItems = navigationSectionsWithChildren[idx]	;
		sections.push({
			type: 'navigationSubSection',
			items: childSectionItems.items,
			title: idx,
			typeId: childSectionItems._id
		});
	}

	// find user plant interest 
	let plantInterestTags = await ProductTag.find({handle: {$in: user.plantInterests}});
	// get products for each tag
	for (var idx in plantInterestTags) {
		let tag = plantInterestTags[idx];
		let tagPlantInterestProducts = await Product.find({tagIds: tag._id});
		if (tagPlantInterestProducts.length >= 1) {
			sections.push({
				type: 'userInterestSection',
				items: tagPlantInterestProducts,
				title: `Because you liked ${tag.title}`,
        handle: tag.handle,
				typeId: tag._id
			});
		}
	}

	// find user plant requirements
	let plantRequirementsTags = await ProductTag.find({handle: {$in: user.plantRequirements}});

	// find user plant requirements	
	for (var idx in plantRequirementsTags) {
		let tag = plantRequirementsTags[idx];
		let tagPlantRequirementsProducts = await Product.find({tagIds: tag._id});
		if (tagPlantRequirementsProducts.length >= 1) {
			sections.push({
				type: 'userRequirementsSection',
				items: tagPlantRequirementsProducts,
				title: tag.title,
				typeId: tag._id
			});
		}
	}

  // find all the user shops
  const stores = await Store.find({productIds: {$exists: true, $ne: []}}).populate('productIds').limit(10);
  sections.push({
    type: 'shopCollectionSection',
    items: stores,
    title: 'Popular Stores',
    typeId: 'popular-stores'
  });
  //console.log("Stores section", stores)
/*
	let level = user.level;
	let levelTag = await ProductTag.find({shortLinks: {$in: level}});
	// beginner, intermediate, advanced
	let levelProducts = await Products.find({tagId: {$in: levelTag._id}}).limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
	if (levelProducts && levelProducts.length > 0) {
	for (var idx in editorsPickTags) {
		let tag = editorsPickTags[idx];
		console.log('EDITORS TAG: ' + tag.title);
		let products = await Product.find({tagIds: tag._id});
		console.log('EDITORS TAG LENGTH PROD: ' + products.length);
		if (products && products.length > 0) {
		}
	}
		sections.push({
			type: 'tag',
			items: levelProducts,
			title: level,
			typeId: levelTag._id
		});
	}*/
	// pet safe
	// what you should be planting this month
		// get location data, get hardiness zone, find products by hardiness zone
		// search our internal hard database, get all the plants
		// filter by minPlantDate, maxPlantDate
		// then pull products based on plant ids
	//naivgation contextual section
	//popular shops
	// custom collection
	// pull tag ids

	let plantRequirements = user.plantRequirements;
	// plut tagids for plantRequirements

	// get editors pick collection

	let editorsPickTags = await ProductTag.find({type: 'collection-editors-choice'});
	if (editorsPickTags.length > 0) {
			sections.push({
				type: 'editorsPicksCollectionSection',
				items: editorsPickTags,
				title: "Editor's Pick Collections",
				typeId: "collection-editors-choice"
			});

	}

  sections.push({
    type: 'shopCollectionSection',
    items: stores,
    title: 'Stores near you',
    typeId: 'stores-near-you'
  });

	res.json({
		success: true,
		payload: sections
	});
} catch (error) {
  ErrorLog
}

}) ;

module.exports = router;