export default (state) => {
  const { errors } = state;

    let isValid = true;
    if (!state.formData) {
      errors.root = 'Please complete the form.';
      isValid = false;
    } else {
      errors.root = '';
    }

    if (state.formData.isProductVariationsVisible) {
      const { variations } = state.formData;
      if (variations && variations.length === 0) {
        errors.variations = 'Please add variations or toggle off.';
        isValid = false;
      } else {
        errors.variations = '';
      }
    }

    if (!state.formData.isProductVariationsVisible) {
      const { productPrice } = state.formData;
      if (!productPrice || productPrice.length < 1) {
        errors.productPrice = 'Enter a valid price.';
        isValid = false;
      } else {
        errors.productPrice = '';
      }
      const { productQuantity } = state.formData;
      if (!productQuantity || productQuantity.length < 1) {
        errors.productQuantity = 'Enter a valid quantity.';
        isValid = false;
      } else {
        errors.productQuantity = '';
      }
      const { productSKU } = state.formData;
      if (!productSKU || productSKU.length < 3) {
        errors.productSKU = 'Enter a valid SKU.';
        isValid = false;
      } else {
        errors.productSKU = '';
      }
    }

    const { title } = state.formData;
    if (!title || title.length < 3) {
      errors.title = 'Please enter a title.';
      isValid = false;
    } else {
      errors.title = '';
    }

    const { description } = state.formData;
    if (!description || description.length === 0) {
      errors.description = 'Please enter a description.';
      isValid = false;
    } else {
      errors.description = '';
    }

    // productTags
    const { productTags } = state.formData;
    if (!productTags || productTags.length === 0) {
      errors.productTags = 'Please select at least one product tag.';
      isValid = false;
    } else {
      errors.productTags = '';
    }
    const { categories } = state.formData;
    if (!categories || categories.length === 0) {
      errors.categories = 'Please select at least one category.';
      isValid = false;
    } else {
      errors.categories = '';
    }

    const { processingTime } = state.formData;
    if (!processingTime || processingTime.length === 0) {
      errors.processingTime = 'Please select a processing time.';
      isValid = false;
    } else {
      errors.processingTime = '';
    }

    const { itemHeightIn } = state.formData;
    if (!itemHeightIn || itemHeightIn.length === 0) {
      errors.itemHeightIn = 'Please enter item height.';
      isValid = false;
    } else {
      errors.itemHeightIn = '';
    }
    const { itemLengthIn } = state.formData;
    if (!itemLengthIn || itemLengthIn.length === 0) {
      errors.itemLengthIn = 'Please enter item length.';
      isValid = false;
    } else {
      errors.itemLengthIn = '';
    }
    const { itemWeightLb } = state.formData;
    if (!itemWeightLb || itemWeightLb.length === 0) {
      errors.itemWeightLb = 'Please enter item weight.';
      isValid = false;
    } else {
      errors.itemWeightLb = '';
    }
    const { itemWeightOz } = state.formData;
    if (!itemWeightOz || itemWeightOz.length === 0) {
      errors.itemWeightOz = 'Please enter item weight (oz).';
      isValid = false;
    } else {
      errors.itemWeightOz = '';
    }
    const { itemWidthIn } = state.formData;
    if (!itemWidthIn || itemWidthIn.length === 0) {
      isValid = false;
      errors.itemWidthIn = 'Please enter item width (in).';
    } else {
      errors.itemWidthIn = '';
    }

    const { productPhotos } = state.formData;
    if (!productPhotos || productPhotos.length === 0) {
      errors.productPhotos = 'Please select product photos.';
      isValid = false;
    } else {
      errors.productPhotos = '';
    }

    const { originZipCode } = state.formData;
    if (!originZipCode || originZipCode.length === 0) {
      isValid = false;
      errors.originZipCode = 'Please enter zip code.';
    } else {
      errors.originZipCode = '';
    }


    if (!isValid) {
      errors.root = 'Please complete all required fields in the form.';
    }  else {
      errors.root = '';
    }

    return {
      isValid,
      errors
    }
}