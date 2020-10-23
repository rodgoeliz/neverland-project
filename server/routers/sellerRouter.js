var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Address = require('../models/Address');
var Store = require('../models/Store');
var Product = require('../models/Product');
var ProductTag = require('../models/ProductTag');
var SellerProfile = require('../models/SellerProfile');

const BASICS_STEP_ID = 'seller-onboarding-basics-step';
const SHOP_STEP_ID = "seller-onboarding-shop-basics-step"

const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

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
	let now = new Date();
	let sellerUser = null;
	//create a stripe express account
	if (stepId == BASICS_STEP_ID) {
		let email = formData.email;
		let firebaseUser = formData.firebaseUser;
		let user = await User.findOne({email: email}).populate("seller");
		let newSellerAddress = new Address({
			createdAt: now,
			updatedAt: now,
			isActive: true,
			isShippingAddress: true,
			addressCity: formData.addressInput.city,
			addressState: formData.addressInput.state,
			addressCountry: "USA",
			addressLine1: formData.addressInput.street,
			addressLine2: formData.addressInput.street_two,
			addressZip: formData.addressInput.zip_code,
			userId: user,
		});
		let address = await newSellerAddress.save();

		// create a stripe account
		const account = await stripe.accounts.create({
		  type: 'express',
		  email: email,
		});
		// create a stripe account link
		const accountLinks = await stripe.accountLinks.create({
		  account: account.id,
		  refresh_url: 'https://www.enterneverland.com/seller-onboarding/reauth/' + account.id,
		  return_url: 'https://www.enterneverland.com/seller-onboarding/return/' + account.id,
		  type: 'account_onboarding',
		});
		if (!account) {
			res.json({
				success: false,
				error: "Stripe account creation failed."
			});
		}

		let sellerProfile = new SellerProfile({
			createdAt: now,
			updatedAt: now,
			personalAddress: address,
			phoneNumber: formData.phoneNumber,
			stripeUID: account.id,
			userId: user,
			sellerInterestReason: formData.sellerInterestReason,
			sellerReferralSource: formData.sellerReferralSource,
			sellerChallenge: formData.sellerChallenge,
			statesCanNotShipTo: formData.stateSelectedItems,
			productCategoriesSold: formData.productSelectedItems,
			storesSellerSellsAt: formData.sellerStoreSelectedItems,
			fullName: formData.fullName,
			birthday: formData.birthday,
			productSource: formData.selelrProductSource,
			packingDetails: formData.sellerPacking,
		});
		let newSellerProfile = await sellerProfile.save();	
		if (user) {
			user.isSeller = true;
			user.firebaseUID = firebaseUser.uid;
			user.isProfileComplete = false;
			user.sellerProfile = newSellerProfile;
			user.password = formData.password;
			user.name = formData.fullName
			sellerUser = await user.save();
		} else {
			let newUser = new User({
				name: formData.fullName,
				firebaseUID: firebaseUser.uid,
				email: email,
				password: formData.password,
				sellerProfile: newSellerProfile,
				isProfileComplete: false
			});
			sellerUser = await newUser.save();
		}
		res.json({
			success: true,
			payload: {
				sellerUser,
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
	if (stepId == SHOP_STEP_ID) {
		let userId = req.body.userId;
		// pull user id and see if store exists
		let user = await User.findOne({_id: userId}).populate('storeId');
		if (!user.storeId) {
			let newSellerBusinessAddress = new Address({
				createdAt: now,
				updatedAt: now,
				isActive: true,
				isShippingAddress: true,
				addressCity: formData.shopAddressInput.city,
				addressState: formData.shopAddressInput.state,
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
				website: formData.shopWebsite,
				userId: userId
			});
			newStore = await newStore.save();	
			user.storeId = newStore;
			let updatedUser = await user.save();
			updatedUser = await User.populate(updatedUser, 'storeId');
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
				website: formData.shopWebsite
			}});
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
					addressLine1: formData.shopAddressInput.street,
					addressLine2: formData.shopAddressInput.street_two,
					addressZip: formData.shopAddressInput.zip_code,
				}
			});
			let updatedUser = await User.populate(user, 'storeId')
			res.json({
				success: true,
				payload: updatedUser
			});
		}
	}

});


module.exports = router;