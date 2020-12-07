import { formatPrice } from './helpers';

const MIN_PRICE_DEFAULT = 10000000000;
const MAX_PRICE_DEFAULT = 0;

export function displayPayment(product, selectedVariations = {}) {
  if (!product || !product.price || !product.price.value) {
    return 'Pricing Unavailable';
  }

  let totalPrice = product.price.value;
  const variations = Object.values(selectedVariations);

  if (variations.length) {
    variations.forEach((variation) => {
      if (variation.price && variation.price.value) {
        totalPrice += variation.price.value;
      }
    });
  }

  return formatPrice(totalPrice, product.price.currency);

  // // display product price range of variants
  // let minPrice = MIN_PRICE_DEFAULT;
  // let maxPrice = MAX_PRICE_DEFAULT;
  // if (product.variationIds && product.variationIds.length > 0) {
  //   for (let i = 0; i < product.variationIds.length; i++) {
  //     const options = product.variationIds[i].optionIds;
  //     if (options) {
  //       for (let j = 0; j < options.length; j++) {
  //         let priceObj = options[j].price;
  //         if (!priceObj || !priceObj.value) {
  //           continue;
  //         }
  //         let price = parseFloat(priceObj.value) / 100;
  //         if (price < minPrice) {
  //           minPrice = price;
  //         }
  //         if (price > maxPrice) {
  //           maxPrice = price;
  //         }
  //       }
  //     }
  //   }
  //   if (minPrice !== MIN_PRICE_DEFAULT || maxPrice !== MAX_PRICE_DEFAULT) {
  //     let minPriceVal = minPrice.toLocaleString('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     });
  //     let maxPriceVal = maxPrice.toLocaleString('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     });
  //     return minPriceVal + '-' + maxPriceVal;
  //   } else {
  //     return 'Pricing Unavailable';
  //   }
  // } else {
  //   if (product && !product.price.value) {
  //     return 'Pricing Unavailable';
  //   }
  //   const value = product.price.value / 100;
  //   return value.toLocaleString('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   });
  // }
}
