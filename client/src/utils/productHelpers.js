import { shippingPreferences } from 'constants/storeData';

const PROCESSING_TIME_VALUES = [
  { id: 'twenty-four-hours', value: '24 Hrs' },
  { id: 'two-three-days', value: '2-3 days' },
  { id: 'three-five-days', value: '3-5 days' },
  { id: 'one-two-weeks', value: '1-2 weeks' },
  { id: 'more-than-two-weeks', value: '2+ weeks' },
];

export const transformProductToFormData = (currentStore, product) => {
  let formData = {};
  const formDataBase = {
    productPhotos: [],
    productPhotosData: [],
    variations: [],
    variationFormData: {},
    isVisible: true,
    isProductVariationsVisible: false,
    errors: {}
  };

  function getProcessingTime(id) {
    for (let i = 0; i < PROCESSING_TIME_VALUES.length; i++) {
      const ptValue = PROCESSING_TIME_VALUES[i];
      if (ptValue.id === id) {
        return ptValue;
      }
    }
  }
  const transformedVariations = [];
  const variations = product.variationIds;
  for (const idx in variations) {
    const variation = variations[idx];
    const transformedOptions = [];
    for (const jdx in variation.optionIds) {
      const option = variation.optionIds[jdx];
      if (option.price) {
        option.price = option.price.value / 100;
      }
      transformedOptions.push(option);
    }
    variation.options = transformedOptions;
    transformedVariations.push(variation);
  }
  const transformedProductPhotos = product.imageURLs.map((imageURL) => ({ sourceURL: imageURL }));
  const processingTime = getProcessingTime(product.processingTime);
  let offerFreeShipping = product.offerFreeShipping ? product.offerFreeShipping : false;
  if (currentStore && currentStore.shippingPreference === shippingPreferences.MANUAL) {
    offerFreeShipping = true;
  }

  formData = {
    title: product.title,
    description: product.description,
    handle: product.handle,
    itemHeightIn: product.heightIn.toString(),
    itemWidthIn: product.widthIn.toString(),
    itemLengthIn: product.lengthIn.toString(),
    itemWeightLb: product.weightLb.toString(),
    itemWeightOz: product.weightOz.toString(),
    productSKU: product.sku,
    isVisible: product.isVisible,
    isArtificial: product.isArtificial ? product.isArtificial : false,
    isOrganic: product.isOrganic ? product.isOrganic : false,
    processingTime: processingTime ? [processingTime] : null,
    originZipCode: product.originZipCode,
    handlingFee: [product.handlingFee],
    offerFreeShipping,
    colors: product.colors,
    benefit: product.benefit,
    style: product.style,
    productPhotos: transformedProductPhotos,
    productPhotosData: transformedProductPhotos,
    variations: transformedVariations,
    productTags: product.tagIds,
    categories: product.categoryIds,
    isProductVariationsVisible: transformedVariations.length > 0,
    storeId: [product.storeId],
    metaData: product.searchMetaData ? product.searchMetaData : {}
  };

  if (product.price && product.price.value) {
    const transformedValue = product.price.value / 100;
    formData.productPrice = transformedValue.toString();
  }
  if (product.inventoryInStock) {
    formData.productQuantity = product.inventoryInStock.toString();
  }
  return {
    ...formDataBase,
    ...formData,
  };
}