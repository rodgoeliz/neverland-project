var rootConfig = require('../data/rootConfig');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_LIVE_KEY);

module.exports.createSellerStripeAccount = async () => {
	const account = await stripe.accounts.create({
		type: 'express'
	});

	const accountLinks = await stripe.accountLinks.create({
		account: account.id,
		refresh_url: "",
		return_url: "",
		type: "account_onboarding"
	})	
}

module.exports.createStripeAccountForUser = async (email) => {
	return await stripe.customers.create({
		email
	});
}
