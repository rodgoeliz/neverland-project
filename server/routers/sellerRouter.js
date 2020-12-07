var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Address = require('../models/Address');
var Store = require('../models/Store');
var Product = require('../models/Product');
var ProductTag = require('../models/ProductTag');
var NavigationItem = require('../models/NavigationItem');
var SellerProfile = require('../models/SellerProfile');

const SELLER_SIGNUP_BASICS_STEP_ID = 'seller_signup_basics';
const SELLER_SIGNUP_SHOP_BASICS = 'seller_signup_shop_basics';
const SELLER_SIGNUP_PAYMENT = 'seller_signup_basics';
const SELLER_SIGNUP_ADD_PRODUCTS = 'seller_signup_add_products';
const BASICS_STEP_ID = 'seller-onboarding-basics-step';
const SHOP_STEP_ID = "seller-onboarding-shop-basics-step"
const { getEnvVariable } = require("../utils/orderProcessor");
const stripe = require('stripe')(getEnvVariable('STRIPE_SECRET_KEY');

router.get(`/onboarding/stripe/reauth`, async function(req, res, next) {
	let stripeId = req.query.stripeId;
});

router.get(`/onboarding/stripe/continue`, async function(req, res, next) {
	let stripeId = req.query.stripeId;
	const account = await stripe.accounts.retrieve(accountId);

});

router.get(`/product/categories/get`, async function(req, res, next) {
  // if no id specified, we get all categories
  let categoryId = req.query.id;
  let query = {};
  try {
  	let categories = await NavigationItem.find(query);
  	res.json({
  		success: true,
  		payload: categories
  	});
  } catch (error) {
  	res.json({
  		success: false,
  		payload: error.message
  	});
  }
});

router.get('/products/get', async function(req, res, next) {
  console.log("Get product")
  console.log(req.query)
  let productId = req.query.productId;
  let product = await Product.findOne({_id: productId})
    .populate({
      path: 'storeId', 
      populate: {
        path: 'userId', 
        model: 'User'
    }})
    .populate('userId')
    .populate('categoryIds')
    .populate({
      path: 'variationIds',
      populate: {
        path: 'optionIds'
    }})
    .populate('tagIds');
  res.json({
    success: true,
    payload: product});
});
router.get(`/product/tags/get`, async function(req, res, next) {
  console.log("get all product tags")
  // if no id specified, we get all tags
  let tagId = req.query.id;
  let query = {};
  try {
    let productTags = await ProductTag.find(query);
    res.json({
      success: true,
      payload: productTags
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: "Failed to fetch product tags."
    });
  }
});

router.get(`/onboarding/getPaymentStatus`, async function(req, res, next) {
	let accountId = req.body.stripeId;
	const account = await stripe.accounts.retrieve(accountId);
	res.json({
		success: true,
		payload: account
	});
});

/**

	formData: {
		fullName,
		email,
		phoneNumber,
		password,
		addressInput : {
			full_name,
			street,
			street_two,
			city,
			state,
			country,
			zip_code
		},
		sellerInterestReason,
		sellerReferralSource,
		sellerChallenge,
		stateSelectedItems,
		productSelectedItems,
		sellerStoreSelectedItems,
		sellerProductSource,
		sellerPacking
	}
}**/
router.get(`/account-links/get`, async function(req, res, next) {
  console.log("account links get....")
  console.log(process.env)
  let sellerId = req.query.sellerId;
  let source = req.query.source;
  let user = await User.findOne({_id: sellerId}).populate('sellerProfile');
  if (!user || !user.sellerProfile) {
    res.json({
      success: false,
      error: "Couldn't find this seller."
    });
    return;
  }
  console.log(user)
  let stripeUID = user.sellerProfile.stripeUID;
  console.log(stripeUID)
  let env = process.env.NODE_ENV || 'development';
  let baseURL = "https://www.enterneverland.com";
  if (env == 'development') {
    baseURL = "http://localhost:3000"
  }
  let accountLinks = await stripe.accountLinks.create({
      account: stripeUID,
      refresh_url: `${baseURL}/seller-onboarding/reauth/${stripeUID}`,
      return_url: `${baseURL}/seller-onboarding/return/${stripeUID}`,
      type: 'account_onboarding',
  });
  if (source == 'web') {
    console.log("creating a web link...")
    accountLinks = await stripe.accountLinks.create({
      account: stripeUID,
      refresh_url: `${baseURL}/seller/onboarding/reauth/web/${stripeUID}`,
      return_url: `${baseURL}/seller/onboarding/return/web/${stripeUID}`,
      type: 'account_onboarding',
    });
  }
  console.log("account links created", accountLinks)
  res.json({
    success: true,
    payload: accountLinks
  });
});

router.get(`/onboarding/getStripeSetupLink`, async function(req, res, next) {
	let userId = req.query.userId;
	let user = await User.findOne({_id: userId}).populate('sellerProfile');
	if (!user.sellerProfile) {
		res.json({
			success: false,
			error: "Seller profile doesn't exist for user: " + userId
		});
	}
	let stripeUID = user.sellerProfile.stripeUID;

	const accountLinks = await stripe.accountLinks.create({
		  account: stripeUID,
		  refresh_url: 'http://localhost:3000/seller-onboarding/reauth/' + stripeUID,
		  return_url: 'http://localhost:3000/seller-onboarding/return/' + stripeUID,
		  type: 'account_onboarding',
	});
});

router.get(`/products/getAll`, async function(req, res, next) {
	let userId = req.query.userId;
	let user = await User.findOne({_id: userId}).populate('storeId');
	if (!user) {
		res.json({
			success: false,
			error: "Failed to find user: " + userId
		});
	}
	let products = await Product.find({vendorId: userId}).populate({path: 'variationIds', populate: { path: 'optionIds'}}).populate('vendorId').populate('tagIds');
	res.json({
		success: true,
		payload: products
	});

});

router.post('/onboarding/submit', async function(req, res, next) {
	let stepId = req.body.stepId;
	let formData = req.body.formData;
	let userId = req.body.userId;
  let source = req.body.source;
	let now = new Date();
	let sellerUser = null;
	console.log("Submitting step", stepId)
	console.log("user id: ", userId)
	console.log("form data", formData)
	//create a stripe express account
	if (stepId == SELLER_SIGNUP_BASICS_STEP_ID) {
		let email = formData.email;
		let firebaseUser = formData.firebaseUser;
		let user = await User.findOne({_id: userId}).populate('sellerProfile');
		if (!user) {
			console.log("couldn't find a registered user -- how did this happen?")
			res.json({
				success: false,
				error: "User couldn't be found for this e-mail."
			});
		}
		let firebaseUID = user.firebaseUID;
		let newSellerAddress = new Address({
			createdAt: now,
			updatedAt: now,
			isActive: true,
			isShippingAddress: true,
			addressCity: formData.addressInput.city,
			addressState: formData.addressInput.state,
			addressCounty: formData.addressInput.county,
			addressCountry: "USA",
			addressLine1: formData.addressInput.street,
			addressLine2: formData.addressInput.street_two,
			addressZip: formData.addressInput.zip_code,
			userId: user,
		});
		let address = await newSellerAddress.save();

		console.log("Saved seller address...", address);

		// create a stripe account
		const account = await stripe.accounts.create({
		  type: 'express',
		  email: user.email,
		});
		// create a stripe account link
		let accountLinks = await stripe.accountLinks.create({
		  account: account.id,
		  refresh_url: 'https://www.enterneverland.com/seller-onboarding/reauth/' + account.id,
		  return_url: 'https://www.enterneverland.com/seller-onboarding/return/' + account.id,
		  type: 'account_onboarding',
		});
    if (source == 'web') {
      accountLinks = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://www.enterneverland.com/seller-onboarding/reauth/web' + account.id,
        return_url: 'https://www.enterneverland.com/seller-onboarding/return/web' + account.id,
        type: 'account_onboarding',
      });
    }

		if (!account) {
			res.json({
				success: false,
				error: "Stripe account creation failed."
			});
		}
		console.log("Created a stripe accounts link...")
		console.log("accountLinks", accountLinks);
		const transformData = function(key, data, isSingle) {
			let transformedData = [];
			for (var idx in data) {
				let item = data[idx];
				transformedData.push(item[key]);
			}
			if (isSingle && transformedData.length == 1) {
				return transformedData[0]
			}
			return transformedData;
		}
		let sellerProfile = new SellerProfile({
			createdAt: now,
			updatedAt: now,
			personalAddress: address,
			phoneNumber: formData.phoneNumber,
			stripeUID: account.id,
			userId: user,
			sellerInterestReason: transformData("id", formData.sellerInterestReason, true),
			sellerReferralSource: transformData("id", formData.sellerReferralSource, true),
			sellerChallenge: formData.sellerChallenge,
			statesCanNotShipTo: transformData("abbreviation", formData.stateSelectedItems, false),
			productCategoriesSold: transformData("id", formData.productSelectedItems, false),
			storesSellerSellsAt: transformData("id", formData.sellerStoreSelectedItems, false),
			fullName: formData.fullName,
			birthday: formData.birthday,
			productSource: formData.sellerProductSource,
			packingDetails: formData.sellerPacking,
		});
		let newSellerProfile = await sellerProfile.save();
		console.log("Saved seller profile")
		console.log(newSellerProfile)

		console.log("updating user with new seller profile info...")
		let result = await User.findOneAndUpdate({_id: userId}, {
			$set: {
				isSeller: true,
				firebaseUID: firebaseUID,
				isProfileComplete: false,
				phoneNumber: formData.phoneNumber,
				sellerProfile: newSellerProfile,
				name: formData.fullName,
				onboardingStepId: stepId,
			}
		}, {new: true}).populate({path: 'sellerProfile', populate: {path: 'personalAddress'}});
		console.log(result)
		res.json({
			success: true,
			payload: {
				sellerUser: result,
				accountLinks
		}});
	}
	/**
	{
	shopTitle
	shopHandle
	shopWebsite
	shopDescription
	shopAddress
	isShopOwner
	shopOwners
	}**/
	if (stepId == SELLER_SIGNUP_SHOP_BASICS) {
		let userId = req.body.userId;
    console.log("SELLER SIGNUP SHOP BASICS", formData)
		// pull user id and see if store exists
		let user = await User.findOne({_id: userId}).populate('storeId').populate({path: 'sellerProfile', populate: {path: 'personalAddress'}});
		if (!user.storeId) {
			let newSellerBusinessAddress = new Address({
				createdAt: now,
				updatedAt: now,
				isActive: true,
				isShippingAddress: true,
				addressCity: formData.shopAddressInput.city,
				addressState: formData.shopAddressInput.state,
				addressCounty: formData.shopAddressInput.county,
				addressCountry: "USA",
				addressLine1: formData.shopAddressInput.street,
				addressLine2: formData.shopAddressInput.street_two,
				addressZip: formData.shopAddressInput.zip_code,
				userId: userId,
			});
			let newAddress = await newSellerBusinessAddress.save();
			let newStore = new Store({
				createdAt: now,
				updatedAt: now,
				isActive: true,
				activatedAt: now,
				businessAddress: newAddress,
				description: formData.shopDescription,
				title: formData.shopTitle,
				website: formData.website,
				userId: userId
			});
			newStore = await newStore.save();
			console.log("saving user with new stepId and storeId", stepId)
			console.log(newStore)
			let updatedUser = await User.findOneAndUpdate({_id: userId}, {$set: {
				storeId: newStore,
				onboardingStepId: stepId
			}}, {new: true}).populate('storeId').populate({path: 'sellerProfile', populate: {path: 'personalAddress'}});
			console.log("sending back updated user", updatedUser)
			res.json({
				success: true,
				payload: updatedUser
			});
		} else {
			let store = user.storeId;
			// update store
			let updatedStore = await Store.findOneAndUpdate({_id: user.storeId}, { $set: {
				updatedAt: now,
				isActive: true,
				isShippingAddress: true,
				description: formData.shopDescription,
				title: formData.shopTitle,
				website: formData.website
			}}, {new: true});
			// update Address
			let businessAddressId = updatedStore.businessAddress;
			let updatedBusinessAddress = await Address.findOneAndUpdate({_id: businessAddressId}, {
				$set: {
					updatedAt: now,
					isActive: true,
					isShippingAddress: true,
					addressCity: formData.shopAddressInput.city,
					addressState: formData.shopAddressInput.state,
					addressCountry: "USA",
					addressCounty: formData.shopAddressInput.county,
					addressLine1: formData.shopAddressInput.street,
					addressLine2: formData.shopAddressInput.street_two,
					addressZip: formData.shopAddressInput.zip_code,
				}
			});
			let updatedUser = await User.findOneAndUpdate({_id: userId}, {$set: {
				onboardingStepId: formData.stepId
			}}, {new: true}).populate('storeId').populate({path: 'sellerProfile', populate: {path: 'personalAddress'}});
			console.log("STORE EXISTS")
			console.log("updatedUser", updatedUser)
			res.json({
				success: true,
				payload: updatedUser
			});
		}
	}

});


module.exports = router;