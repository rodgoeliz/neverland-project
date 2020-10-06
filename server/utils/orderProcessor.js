var rootConfig = require('../data/rootConfig');
const Taxjar = require('taxjar');
const taxjarClient = new Taxjar({
	apiKey: process.env.TAXJAR_API_TOKEN
});
module.exports.getBuyerProtectionSurcharge = async (subtotal) => {
	let buyerProtectionRules = rootConfig.surchargeRules.buyerProtection;
	for (var i = 0; i < buyerProtectionRules.length; i++) {
		let rule = buyerProtectionRules[i];
		if (subtotal > rule.minThreshold && subtotal < rule.maxThreshold) {
			console.log("Hit a rule")
			let surcharge = rule.surcharge;
			if (surcharge.type == "currency") {
				return subtotal + surcharge.value;
			} else if (surcharge.type = "percent") {
				console.log(subtotal * (surcharge.value/100));
				return subtotal * (surcharge.value/100);
			}
		}
	}
	return 0;
}

module.exports.getFulfillmentMethod = async (carrier, type) => {
	return rootConfig.fulfillmentOptions[carrier][type];
}

module.exports.calculateBundleSubTotal = async (bundle) => {
	let subtotal = 0;
	bundle.productIds.map((product) => {
		let value = parseFloat(product.price)
		subtotal += value;
	});
	return subtotal;
}

module.exports.calculateTaxSurcharge = async (bundleSubtotal, shippingAddress, shippingCharge) => {
	//get tax rate through taxjar api

	let taxSurcharge = await taxjarClient.taxForOrder({
		from_country: 'US',
		from_state: 'CA',
		to_zip: shippingAddress.addressZip,
		to_state: shippingAddress.addressState,
		to_city: shippingAddress.addressCity,
		to_street: shippingAddress.addressLine1,
		to_country: 'US',
		amount: bundleSubtotal,
		shipping: shippingCharge
	}).then((res) => {
		return {
			taxAmount: res.tax.amount_to_collect,
			taxableAmount: res.tax.taxable_amount,
			rate: res.tax.rate
	}});
	return taxSurcharge;
}

