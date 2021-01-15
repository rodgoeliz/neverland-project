export default (jsonObj, formData) => {
    for (const key in jsonObj) {
      switch (key) {
        case 'variations':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'categories':
        case 'productTags':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'description':
        case 'handlingFee':
        case 'itemHeightIn':
        case 'itemWeightLb':
        case 'itemLengthIn':
        case 'itemWeightOz':
        case 'itemWidthIn':
        case 'originZipCode':
        case 'productPrice':
        case 'productQuantity':
        case 'productSKU':
        case 'title':
          formData.append(key, jsonObj[key]);
          break;
        case 'storeId':
          break;
        case 'productPhotos':
          formData.append(key, JSON.stringify(jsonObj[key]));
          break;
        case 'processingTime':
          const processingTime = jsonObj[key];
          if (processingTime.length > 0) {
            formData.append(key, processingTime[0].id);
          }
          break;
        case 'metaData.light':
        case 'metaData.color':
        case 'metaData.level':
        case 'metaData.water-level':
        case 'metaData.style':
        case 'metaData.benefit':
        case 'metaData.size':
        case 'metaData':
          if (key && jsonObj[key]) {
            formData.append(key, JSON.stringify(jsonObj[key]));
          }
          break;
        default:
          formData.append(key, jsonObj[key]);
          break;
      }
    }
  return formData;
}