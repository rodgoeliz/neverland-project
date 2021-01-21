var express = require("express");
require('dotenv').config();
var router = express.Router();
var PaymentMethod = require('../models/PaymentMethod');
var Address = require('../models/Address');
var Order = require('../models/Order');
var User = require('../models/User');
var ProductTag = require('../models/ProductTag');
var Product = require('../models/Product');
var Store = require('../models/Store');
var SellerProfile = require('../models/SellerProfile');
var NavigationMenu = require('../models/NavigationMenu');
var NavigationItem = require('../models/NavigationItem');
const mongoose = require('mongoose');
var products = require('../data/products.json');
var stores = require('../data/stores.json');
var users = require('../data/users.json');
const algoliasearch = require("algoliasearch");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex("dev_neverland_products");


router.post('/test-data/init/algolia', async function (req, res, next) {
  console.log("ROOT ROUTER TEST")
  /*index.saveObjects(products, {'autoGenerateObjectIDIfNotExist': true})
    .then(({objectIDs}) => {
      res.json({success: true})
    }).catch(err => {
      console.log(err)
      res.json({success: false})
    });*/
});

router.post('/test-data/init', async function (req, res, next) {
  let now = new Date();

  // todo update store id in user
  let userHandleToUserId = {};
  let userHandleToOldUser = {};
  for (var idx in users) {
    let user = users[idx];
    userHandleToOldUser[user.id] = user;
    let userObj = await User.findOne({ email: user.email });
    if (userObj) {
      userHandleToUserId[user.id] = userObj;
    } else {
      let userId = mongoose.Types.ObjectId();
      let spId = mongoose.Types.ObjectId();
      let newSellerProfile = new SellerProfile({
        _id: spId,
        stripeUID: user.sellerProfile.stripeUID,
        userId: userId,
      })

      let newUserSchema = new User({
        _id: userId,
        email: user.email,
        name: user.name,
        avatarURL: user.avatarURL,
        zipCode: user.zipCode,
        phoneNumber: user.phoneNumber,
        isSeller: true,
        sellerProfile: spId
      });

      let newUserObj = await newUserSchema.save();
      userHandleToUserId[user.id] = newUserObj;
    }
  }

  console.log("Generated all the users...")
  console.log(userHandleToUserId)

  console.log("Starting to generate all the products...")
  // todo: update vendorId once users are created
  // initialize all the products
  let productHandleToIdMap = {};
  let productHandleToOldProductMap = {};
  let toAlgoliaImport = [];
  for (var idx in products) {
    let product = products[idx];
    productHandleToOldProductMap[product.handle] = product;
    let newId = mongoose.Types.ObjectId();
    let tagHandles = product.tagIds;
    let tagIds = []
    for (var jdx in tagHandles) {
      let tagHandle = tagHandles[jdx];
      let tag = await ProductTag.findOne({ handle: tagHandle });
      if (tag) {
        tagIds.push(tag);
      } else {
        let newTagSchema = new ProductTag({
          handle: tagHandle,
          title: tagHandle,
          description: tagHandle,
          createdAt: now,
          updatedAt: now
        });

        let newTag = await newTagSchema.save();
        tagIds.push(newTag._id);
      }
    }
    console.log("Getting vendor...")
    console.log(product.vendorId)
    let vendor = userHandleToUserId[product.vendorId];
    if (!vendor) {
      console.log("couldn't get vendor.. did you install right users?", product.vendorId)
    };
    let newProductSchema = new Product({
      title: product.title,
      handle: product.handle,
      imageURLs: product.imageURLs,
      description: product.description,
      handle: product.handle,
      inventoryAvailableToSell: product.inventoryAvailableToSell,
      inventoryInStock: product.inventoryInStock,
      isVisible: product.isVisible,
      userLevel: product.userLevel,
      colors: product.colors,
      lightLevel: product.lightLevel,
      benefit: product.benefit,
      isOrganic: product.isOrganic,
      isArtificial: product.isArtificial,
      style: product.style,
      sku: product.sku,
      width: product.width,
      height: product.height,
      weight: product.weight,
      price: product.price,
      tagIds: tagIds,
      _id: newId,
      vendorId: vendor._id
    });
    product.tagObjIds = tagIds;
    product.vendorId = vendor._id;
    product._id = newId;
    let newProduct = await newProductSchema.save();
    product.objectID = newId;
    toAlgoliaImport.push(product);
    productHandleToIdMap[product.handle] = newProduct;
  }

  console.log("Generated all the products...")
  console.log(productHandleToIdMap);

  console.log("Import to algolia...")
  index.saveObjects(toAlgoliaImport, { 'autoGenerateObjectIDIfNotExist': true })
    .then(({ objectIDs }) => {
      console.log("Saved objects")
      res.json({ success: true })
    }).catch(err => {
      console.log(err)
      res.json({ success: false })
    });
  console.log("Generated all the stores...")
  let storeHandletoStore = {};
  // create stores
  for (var idx in stores) {
    let store = stores[idx];
    let storeProducts = [];
    for (var jdx in stores.productIds) {
      let productHandle = stores.productIds[jdx];
      storeProducts.push(productHandleToIdMap[productHandle]);
    }
    let newStoreSchema = new Store({
      createdAt: now,
      updatedAt: now,
      isActive: true,
      handle: store.handle,
      title: store.title,
      productIds: storeProducts,
      userId: userHandleToUserId[store.userId]
    });
    let storeObj = await newStoreSchema.save();
    storeHandletoStore[store.handle] = storeObj;
  }
  console.log("Generated all the stores...")
  console.log(storeHandletoStore)
  // update user and products with the right store id
  for (var key in userHandleToUserId) {
    let user = userHandleToUserId[key];
    let oldUser = userHandleToOldUser[key];
    user.storeId = storeHandletoStore[oldUser.storeId];
    await user.save();
  }

  // update store id in all the products
  for (var key in productHandleToIdMap) {
    let product = productHandleToIdMap[key];
    let oldProduct = productHandleToOldProductMap[key];
    product.storeId = storeHandletoStore[oldProduct.storeId]
    product.save();
  }
  res.json({
    success: true
  })
});

/**
 Load navigation, default payment method, default billing address, default shipping address
 **/
router.get('/init', async function (req, res, next) {
  let userId = req.query.userId;
  let menuHandle = req.query.menuHandle;
  let allInitPromises = [];
  console.log("init app for")
  console.log(userId)
  let menu = await NavigationMenu
    .findOne({ handle: menuHandle })
    .then(async (menu) => {
      let menuItems = await NavigationItem.find({ menuId: menu._id });
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
  }).populate('userId');
  allInitPromises.push(shippingAddress);

  // find all shipping addresses
  let allShippingAddresses = await Address.find({
    isActive: true,
    isShippingAddress: true,
    userId: userId
  }).populate('userId');
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

  let user = await User.findOne({
    _id: userId
  });
  allInitPromises.push(user);
  Promise.all(allInitPromises).then((results) => {
    // parse results and return to client
    let navigationMenu = results[0];
    let paymentMethod = results[1];
    let shippingAddress = results[2];
    let allShippingAddresses = results[3];
    let allPaymentMethods = results[4];
    let allOrders = results[5];
    let user = results[6]
    console.log("Orders")
    console.log(allOrders)
    console.log("USER is profile complete: ", user.isProfileComplete)
    console.log("Onboarding step id: ", user.onboardingStepId)
    res.json({
      success: true,
      payload: {
        navigationMenu: navigationMenu,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        allShippingAddresses: allShippingAddresses,
        allPaymentMethods: allPaymentMethods,
        allOrders: allOrders,
        isProfileComplete: user.isProfileComplete,
        stepId: user.onboardingStepId,
        isSeller: user.isSeller
      }
    })
  });
});

module.exports = router;