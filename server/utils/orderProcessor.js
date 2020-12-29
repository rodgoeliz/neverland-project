var rootConfig = require('../data/rootConfig');
const Taxjar = require('taxjar');
var OrderProductItem = require('../models/OrderProductItem');
const taxjarClient = new Taxjar({
	apiKey: process.env.TAXJAR_API_TOKEN
});

module.exports.getStripeFee = async (total) => {
  return Math.round(total * .029);
}

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

module.exports.calculateShippingFromBundle = async (order, bundleId) => {
  const bundle = await Bundle.find({_id: bundleId})
    .populate({
      path: 'productOrderItemIds',
      populate: 'productId'})
    .populatee({
      path: 'storeId',
      populate: 'packageProfileIds'
    });
  let length, height, width = 0;
  let weightLb, weightOz = 0;
  let zipCodeOrigin = null;
  bundle.productOrderItemIds.map((item) => {
    const product = item.productId; 
    length += product.lengthIn;
    height += product.heightIn;
    width += product.widthIn;
    weightLb += product.weightLb;
    weightOz += product.weightOz;
    zipCodeOrigin = item.originZipCode;
  });

  let reccPackageProfile = null;
  bundle.packageProfileIds.map((profile) => {
    if (length <= profile.length && width <= profile.width && height <= profile.height) {
      reccPackageProfile = profile;
    }
  });
  let shippingAddress = order.shippingAddressId;
  const shipZip = order.addressZip;
  // check origin zip codes and make sure equal, otherwise, we need two shipping labels?

  if (profile)  {
    // get shippo rates for this profile 
  } else {
    // get shippo rates for recommended length, height, width  and weight
  }
}

module.exports.getFulfillmentMethod = async (carrier, type) => {
	return rootConfig.fulfillmentOptions[carrier][type];
}

module.exports.calculateBundleSubTotal = async (bundle) => {
	let subtotal = 0;
  let productOrderItems = await OrderProductItem.find({_id: {$in: bundle.productOrderItemIds}})
    .populate('selectedOptionIds').populate('productId');
  let totalPrice = 0;
  // go through product order items
  productOrderItems.map((productOrderItem) => {
    let price = productOrderItem.productId.price.value;
    let basePrice = 0;
    if (price && !isNaN(price)) {
      basePrice += parseFloat(price);
    }
    // go through options and add the additional pricing
    for (var i in productOrderItem.selectedOptionIds) {
      let option = productOrderItem.selectedOptionIds[i] ;
      basePrice += parseFloat(option.price.value);
    }
    
    // multiply by the quantity needed
    basePrice = basePrice * productOrderItem.quantity;
    totalPrice += basePrice;
  });
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

