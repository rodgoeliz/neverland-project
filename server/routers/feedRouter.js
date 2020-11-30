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
var ProductCollection = require('../models/ProductCollection');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const CONTEXTUAL_SECTION_PRODUCT_LIMIT = 15;
//for feed, we will get the following sections
// 1. Recently added products for your expressed interests
// 2. Recently added stores & stores that recently added products
// 3. Recently trending/global produccts
// 4. Popular products in your area
router.get('/feed/home', async function(req, res, next) {
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
  let navigationMenu = await NavigationMenu.findOne({handle: 'main_menu'}).populate({path: 'navigationItemsTopLevel', populate: { path: 'children'}});
  //console.log("navigation menu", navigationMenu)
  let navigationSections = [];
  // navigation sections with children is an array of arrays
  let navigationSectionsWithChildren = {};
  if (navigationMenu) {
    for (var key in navigationMenu.navigationItemsTopLevel) {
      let navItem = navigationMenu.navigationItemsTopLevel[key];
      navigationSections.push(navItem);
      if (navItem.children && navItem.children.length > 0) {
        let subNavSection =[]
        for (var key in navItem.children)  {
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
    let childSectionItems = navigationSectionsWithChildren[idx] ;
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
        title: tag.title,
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

  //console.log(sections)
  res.json({
    success: true,
    payload: sections
  });

}) ;

module.exports = router;