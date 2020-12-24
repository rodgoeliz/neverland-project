var rootConfig = require('../data/rootConfig');
require('dotenv').config();
const { getEnvVariable } = require("../utils/envWrapper");
const Logger = require('../utils//errorLogger');
const stripe = require('stripe')(getEnvVariable('STRIPE_SECRET_KEY'));

module.exports.createStripePayout = async(sellerPayoutLog) => {
  const stripeUID = sellerPayoutLog.userId.sellerProfile.stripeUID;
  const amount = sellerPayoutLog.payoutAmount;
  const account = await stripe.accounts.retrieve(stripeUID);
  if (!account) {
    Logger.logError("Couldn't create a stripe payout because we can't find stripe account for: " + account) ;
  }
  const externalAccounts = account.external_accounts.data;
  const balance = await stripe.balance.retrieve({

  }, {
    stripeAccount: stripeUID
  });
  if (balance.available && balance.available.length > 0 && balance.available[0].amount < amount) {
    console.log("We can't pay out seller..")
    Logger.logError(`[UNAVAILABLE BALANCE FOR PAYOUT] Balance for ${stripeUID} account that we need to pay out, there's not enough available balance. It's still pending.`);
    return {
      success: false
    }
  }
  console.log("BALANCE: ", balance)
  if (externalAccounts.length > 0) {
    const externalDestinationId = account.external_accounts.data[0].id; 
    try {
      let results = await stripe.payouts.create({
        amount,
        source_type: 'bank_account',
        currency: 'usd'
      }, 
      {
        stripeAccount: stripeUID
      });
      if (results) {
      console.log("RESULATS FALSE SUCCESS")
        return {
          success: true
        }
      }
    } catch (error) {
      console.log(error)
      console.log("FALSE SUCCESS")
      Logger.logError(error);
      return {
        success: false
      }
    }
  } else {
    Logger.logError(`Stripe account:${stripeUID} has no set payment destination. failed to pay.`);
    return {
      success: false
    }
  }
}

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
