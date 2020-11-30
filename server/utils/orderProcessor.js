var rootConfig = require('../data/rootConfig');
const Taxjar = require('taxjar');
var OrderProductItem = require('../models/OrderProductItem');
const taxjarClient = new Taxjar({
	apiKey: process.env.TAXJAR_API_TOKEN
});

module.exports.getBuyerProtectionSurcharge = async (subtotal) => {
	let buyerProtectionRules = rootConfig.surchargeRules.buyerProtection;
	for (var i = 0; i < buyerProtectionRules.length; i++) {
		let rule = buyerProtectionRules[i];
		if (subtotal > rule.minThreshold && subtotal < rule.maxThreshold) {
			let surcharge = rule.surcharge;
			if (surcharge.type == "currency") {
				return subtotal + surcharge.value;
			} else if (surcharge.type = "percent") {
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
  console.log(bundle)
  console.log("calculateBundleSubTotal", bundle.productOrderItemIds);
  let productOrderItems = await OrderProductItem.find({_id: {$in: bundle.productOrderItemIds}})
    .populate('selectedOptionIds').populate('productId');
  let totalPrice = 0;
  console.log("calculate productorderitem", productOrderItems) ;
  // go through product order items
  productOrderItems.map((productOrderItem) => {
    console.log(productOrderItem.productId)
    let price = productOrderItem.productId.price.value;
    let basePrice = 0;
    console.log("BASE PRICE", price)
    if (price && !isNaN(price)) {
      basePrice += parseFloat(price);
    }
    console.log("after converting", basePrice)
    console.log(productOrderItem.selectedOptionIds)
    // go through options and add the additional pricing
    for (var i in productOrderItem.selectedOptionIds) {
      let option = productOrderItem.selectedOptionIds[i] ;
      basePrice += parseFloat(option.price.value);
    }
    
    // multiply by the quantity needed
    basePrice = basePrice * productOrderItem.quantity;
    totalPrice += basePrice;
  });
  console.log("Total Price: ", totalPrice);
	return totalPrice;
}

module.exports.calculateTaxSurcharge = async (bundleSubtotal, shippingAddress, shippingCharge) => {
	//get tax rate through taxjar api
return 0;
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

