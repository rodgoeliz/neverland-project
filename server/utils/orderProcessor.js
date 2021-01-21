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

module.exports.generateOrderNumber = async () => {
  let now = Date.now().toString();
  now += now + Math.floor(Math.random() + 10);
  let orderNumber = [now.slice(0,4), now.slice(4, 10), now.slice(10, 14)].join('-');
  const orderNumExists = await Order.findOne({orderNumber});
  // try one more time
  if (orderNumExists) {
    now += now + Math.floor(Math.random() + 10);
    orderNumber = [now.slice(0,4), now.slice(4, 10), now.slice(10, 14)].join('-');
  }
  return orderNumber;
}

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
        return subtotal * (surcharge.value / 100);
      }
    }
  }
  return 0;
}


const getOptimalPackageFromProfile = (packageProfiles, binItems) => {
  // Test out different package profiles with our bin packing algorithm
  packageProfiles.map((packageProfile) => {
    const packer = new Packer();
    const newBin = new Bin(packageProfile.title, packageProfile.length, packageProfile.width, packageProfile.depth, 100 * 16);
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
  if (validPackages.length == 0) {
    // then we didn't find any valid packages to ship in, so we try to do it by weight?
    // what is default shipping rate?
    return null;
  } else {
    const maxVolume = Number.MAX_SAFE_INTEGER;
    validPackages.map((profile) => {
      const volume = profile.height * profile.width * profile.length;
      if (volume < maxVolume) {
        minPackageProfile = profile;
      }
    });
  }

  return minPackageProfile;
}

module.exports.calculateShippingFromBundle = async (bundle, store) => {
  console.log("HELLO..")
  const shippingPreference = store.shippingPreference;
  if (shippingPreference == "manual") {
    // always free shipping to consumer 
    return {
      shippingCost: 0,
      sellerShippingSurcharge: 0
    }
  }
  let length, height, width = 0;
  let weightLb, weightOz = 0;
  let zipCodeOrigin = null;
  var totalWeightOz = 0;
  const binItems = [];

  // create items to pack in bins and calculate total weight of order
  const paidShippingProducts = bundle.productOrderItemIds.filter((item) => {
    return !item.offerFreeShipping;
  });
  let productsToCalcShippingFor = paidShippingProducts;
  // means that all products have free shipping
  if (paidShippingProducts.length == 0) {
    // we need to calculate the shipping and request a label to be created but not charged
    // we need to note that we will pay out seller less the shipping cost
    productsToCalcShippingFor = bundle.productOrderItemIds;
    return 0;
  }
  // calculate shipping for the rest of the products
  productsToCalcShippingFor.map((item) => {
    const weightOz = item.productId.weightLb * 16 + item.productId.weightOz;
    totalWeightOz += weightOz;
    const newItem = new Item(item.productId.title, item.productId.lengthIn, item.productId.widthIn, item.productId.heightIn, weightOz);
    binItems.push(newItem);
  });

  var minPackageProfile = getOptimalPackageFromProfile(bundle.storeId.packageProfileIds, binItems);

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
  let finalShippingRate = minRate;
  if (minPackageProfile.length == 0) {
    // still need to calculate cost and then charge the diff b/t flatshippingrate and the cost of shipping
    // take minRate and flatShippingRate and if diff b/t them is positive, we take it away from take rate
    finalShippingRate = bundle.storeId.flatShippingRate;
  }

  // this means that seller has made free shipping for all products, so they are going to cover the cost of shipping.
  if (paidShippingProducts.length == 0) {
    // charge seller for the shipping in it's entirety
    return {
      shippingCost: 0,
      sellerShippingSurcharge: finalShippingRate,
      shippo: {
        shipment: shipment.object_id,
        rates: rates.object_id
      }
    };
  }

  return {
    shippingCost: finalShippingRate,
    sellerShippingSurcharge: 0,
    shippo: {
      shipment: shipment.object_id,
      rates: rates.object_id
    }
  }
}

module.exports.getFulfillmentMethod = async (carrier, type) => {
  return rootConfig.fulfillmentOptions[carrier][type];
}

module.exports.calculateBundleSubTotal = async (bundle) => {
  let subtotal = 0;
  let productOrderItems = await OrderProductItem.find({ _id: { $in: bundle.productOrderItemIds } })
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
      let option = productOrderItem.selectedOptionIds[i];
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
    }
  });
  return taxSurcharge;
}

