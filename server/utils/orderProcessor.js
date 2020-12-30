var rootConfig = require('../data/rootConfig');
const BinPacking3D = require('binpackingjs').BP3D;
const { Item, Bin, Packer } = BinPacking3D;
const { getEnvVariable } = require("../utils/envWrapper");
const Taxjar = require('taxjar');
var OrderProductItem = require('../models/OrderProductItem');
var Bundle = require('../models/Bundle');
var Order = require('../models/Order');
const shippo = require('shippo')(getEnvVariable('SHIPPO'));
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


module.exports.calculateShippingFromBundle = async (orderi, bundleIdt) => {
  console.log("HELLO..")
  const order = await Order.findOne({_id: "5fe429e80d81e836cbb8192c"}).populate('shippingAddressId');
  console.log(order)
  let bundleId = "5fe4288cae054733f59b79ef";
  const bundle = await Bundle.findOne({_id: bundleId})
    .populate({
      path: 'productOrderItemIds',
      populate: 'productId'})
    .populate({
      path: 'storeId',
      populate: [{
        path: 'packageProfileIds'},{path: 'businessAddress'}]
    });
  let length, height, width = 0;
  let weightLb, weightOz = 0;
  let zipCodeOrigin = null;
  var totalWeightOz = 0;
  const binItems = [];

  // create items to pack in bins and calculate total weight of order
  bundle.productOrderItemIds.map((item) => {
    const weightOz = item.productId.weightLb * 16 + item.productId.weightOz;
    totalWeightOz += weightOz;
    const newItem = new Item(item.productId.title, item.productId.lengthIn, item.productId.widthIn, item.productId.heightIn, weightOz);
    binItems.push(newItem);
  });

  const validPackages = [];

  // Test out different package profiles with our bin packing algorithm
  bundle.storeId.packageProfileIds.map((packageProfile) => {
    const packer = new Packer();
    const newBin = new Bin(packageProfile.title, packageProfile.length, packageProfile.width, packageProfile.depth, 100*16);
    packer.addBin(newBin);
    binItems.map((binItem) => {
      packer.addItem(binItem);
    });
    packer.pack();
    // if there's unfit items, that means package profile won't work.. skip
    if (packer.unfitItems.length == 0) {
      validPackages.push(packageProfile);
    }
  });

  var minPackageProfile = null;
  const totalWeight = 0;
  if (validPackages.length == 0) {
    // then we didn't find any valid packages to ship in, so we try to do it by weight?
    // what is default shipping rate?
    return bundle.storeId.flatShippingRate;
  } else {
    const maxVolume = Number.MAX_SAFE_INTEGER;
    validPackages.map((profile) => {
      const volume = profile.height*profile.width*profile.length;
      if (volume < maxVolume) {
        minPackageProfile = profile;
      }
    });
  }
  console.log("PACKAGE SIZE: ", minPackageProfile)
  // if a valid packageexists, we get smallest dimension and call shippo with that.
  // if it doesn't, we base it on weight...

  // pull shipping address
  // pull shop business address and ship zip code
  // call shippo 
  // get the priority rates, if priority rates don't exist, we do ground shipping
  // create an intent to get that shippig label but do not get it yet..
  // charge user for shipping and do not give to seller - we buy the shipping label on order confirmation


  let shippingAddress = order.shippingAddressId;
  console.log("SHIP ADDreSS tO: ", shippingAddress)
  const addressTo = {
    name: "T#EST",
    street1: order.shippingAddressId.addressLine1,
    city: order.shippingAddressId.addressCity,
    zip: order.shippingAddressId.addressZip,
    state: order.shippingAddressId.addressState,
    country: 'USA'
  };
  const storeAddress = bundle.storeId.businessAddress;
  console.log("FROM SHOP ADDreSS : ", storeAddress)
  const addressFrom = {
    name: "TEST",
    street1: storeAddress.addressLine1,
    city: storeAddress.addressCity,
    zip: storeAddress.addressZip,
    state: storeAddress.addressState,
    country: 'USA'
  } 

  const parcel = {
    "length": minPackageProfile.length,
    "width": minPackageProfile.width,
    "height": minPackageProfile.height,
    "distance_unit": "in",
    "weight": totalWeightOz,
    "mass_unit": "oz"
  }
  console.log("SHIPPO: ", {
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": parcel,
    "async": true
  })
  const shipment = await shippo.shipment.create({
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": parcel,
    "async": true
  });
  console.log("SHIPMENT", shipment)
  const rates = await shippo.shipment.rates(shipment.object_id)
  let minAmount = Number.MAX_SAFE_INTEGER;
  let minRate = null;
  if (rates.results && rates.results.length > 0) {
    rates.results.map((rate) => {
      if (rate.estimated_days <= 3) {
        const rAmount = parseFloat(rate.amount);
        if (rAmount < minAmount) {
          minAmount = rAmount;
          minRate = rate;
        }
      }
    });
  }

  return minRate; 
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

