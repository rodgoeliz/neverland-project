var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const CONTEXTUAL_SECTION_PRODUCT_LIMIT = 15;
router.get('/marketplace-feed', async function(req, res, next) {
	let userId = req.query.userId;
	// if no userId, then go to login
	let user = await User.findOne({_id: userId});
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

	let recentlyViewedProducts = await RecentlyViewedProducts.find({userId: userId}).limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
	if (recentlyViewedProducts && recentlyViewedProducts.length > 0) {
		//create a contextual section	
		sections.push({
			type: 'recentlyViewed',
			items: recentlyViewedProducts,
			title: 'Recently Viewed',
		});
	}
	let level = user.level;
	let levelTag = await ProductTag.find({shortLinks: {$in: level}});
	// beginner, intermediate, advanced
	let levelProducts = await Products.find({tagId: {$in: levelTag._id}}).limit(CONTEXTUAL_SECTION_PRODUCT_LIMIT);
	if (levelProducts && levelProducts.length > 0) {
		sections.push({
			type: 'tag',
			items: levelProducts,
			title: level,
			typeId: levelTag._id
		});
	}
	// pet safe
	// what you should be planting this month
		// get location data, get hardiness zone, find products by hardiness zone
		// search our internal hard database, get all the plants
		// filter by minPlantDate, maxPlantDate
		// then pull products based on plant ids
	//naivgation contextual section
	//popular shops
	// custom collection
	let plantInterests  = user.plantInterests;
	// pull tag ids

	let plantRequirements = user.plantRequirements;
	// plut tagids for plantRequirements

	// get editors pick collection
	let editorsPickTag = await ProductTag.findOne({shortLinks: {$in : 'editors_pick'}});
	let editorsPickCollections = await ProductCollection.findOne({tagId: {$in: editorsPickTag._id}}).populate('productIds');
	sections.push(({
		type: 'editors-pick-collections',
		items: editorsPickCollections.productIds,
		title: editorsPickCollections.title,
		typeId: editorsPickCollections._id
	}));

}) ;

module.exports = router;