var express = require("express");
require('dotenv').config();
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Address = require('../models/Address');
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
	console.log(account);
	console.log(account.charges_enabled)
	console.log(account.details_submitted);

});


router.get(`/onboarding/getPaymentStatus`, async function(req, res, next) {
	let accountId = req.body.stripeId;
	const account = await stripe.accounts.retrieve(accountId);
	console.log("get Payment Status from Stripe: " + accountId);
	console.log(account);
	console.log(account.charges_enabled)
	console.log(account.details_submitted)
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

router.post('/onboarding/submit', async function(req, res, next) {
	console.log("SUBMIT user info")
	console.log(req.body);
	let stepId = req.body.stepId;
	let formData = req.body.formData;
	let now = new Date();
	let sellerUser = null;
	//create a stripe express account
	if (stepId == BASICS_STEP_ID) {
		console.log("BASICS_STEP_ID")
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
			fullName: formData.fullName,
			birthday: formData.birthday
		});
		let address = await newSellerAddress.save();
		console.log("Saved new seller address address")
		console.log(address)

		console.log("Creating a stripe account...")
		// create a stripe account
		const account = await stripe.accounts.create({
		  type: 'express',
		  email: email,
		});
		console.log(account);
		// create a stripe account link
		console.log("Create account link....")
		const accountLinks = await stripe.accountLinks.create({
		  account: account.id,
		  refresh_url: 'https://www.enterneverland.com/seller-onboarding/reauth/' + account.id,
		  return_url: 'https://www.enterneverland.com/seller-onboarding/return/' + account.id,
		  type: 'account_onboarding',
		});
		console.log("ACCOUNT LINKS CREATED...")
		console.log(accountLinks)
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
		console.log("Created sller user...")
		console.log(sellerUser)
		res.json({
			success: true,
			payload: {
				sellerUser,
				accountLinks
		}});
	}

	if (stepId == SHOP_STEP_ID) {

	}

});


module.exports = router;