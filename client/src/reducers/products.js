import actionTypes from '../constants/newActionTypes';

export const initialState = {
  loadedProducts: [],
  productsCache: {},
  sellerProductsCache: {},
  hasNext: true,
  offset: 0,
  limit: 5,
  recentlyViewedProductsCache: [],
  productTags: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.products.ADD_TEST_SELLER_PRODUCT:
      console.log('HERE');
      let newCache = {};
      for (var key in state.sellerProductsCache) {
        newCache[key] = state.sellerProductsCache[key];
      }
      console.log('sellercache add test product', newCache);
      let product = {
        metafields: [],
        style: [],
        colors: [],
        benefit: [],
        imageURLs: [
          'https://enter-neverland.s3.us-west-1.amazonaws.com/product/5fa5ad0f68ae8e6b0f2b4e17/5fa5af1415cb3177a36494a3/Vera%E2%80%99s%20shop-5fa5acda68ae8e6b0f2b4e13productImage0',
        ],
        variationIds: [],
        categoryIds: [
          {
            children: [],
            tagHandles: [],
            tagIds: [],
            _id: '5f6e730f0ac71e65fd55ef8b',
            createdAt: '2020-09-25T22:45:35.229Z',
            updatedAt: '2020-09-25T22:45:35.229Z',
            title: 'Indoor Houseplants',
            handle: 'indoor_houseplants',
            parentId: null,
            menuId: '5f6e72b9d46a6b65118b7701',
            __v: 0,
          },
        ],
        tagIds: [
          {
            _id: '5f5f1ee0a22400e29ee4fe04',
            createdAt: '2020-09-14T07:42:24.618Z',
            title: 'Succulents & Cactus',
            handle: 'succulents-&-cactus',
            __v: 0,
          },
        ],
        _id: '5fa5af1915cb3177a3649b454',
        createdAt: '2020-11-06T20:16:20.052Z',
        updatedAt: '2020-11-06T20:16:20.052Z',
        title: 'Vera’s FLOWER',
        description: 'fjksajklafdsjkldljfdsljflsdaafkljdsfljsda',
        originZipCode: '94117',
        offerFreeShipping: false,
        handle: 'vera’s shop',
        inventoryInStock: 11,
        inventoryAvailableToSell: 11,
        isVisible: true,
        processingTime: 'two-three-days',
        weightLb: 5,
        weightOz: 5,
        heightIn: 5,
        widthIn: 5,
        lengthIn: 5,
        isOrganic: false,
        isArtificial: false,
        storeId: '5fa5ad0f68ae8e6b0f2b4e17',
        vendorId: '5fa5acda68ae8e6b0f2b4e13',
        price: {
          value: 1239,
          currency: 'USD',
        },
        __v: 0,
      };
      newCache[product._id] = product;
      console.log('newsellerproductcache', newCache);
      return {
        ...state,
        sellerProductsCache: newCache,
      };
    case actionTypes.products.ADD_OR_REPLACE_SELLER_PRODUCT:
      console.log('adding or replacing seller product');
      console.log(state);
      let sellerProducts = state.sellerProductsCache;
      if (sellerProducts === undefined) {
        sellerProducts = {};
      }
      console.log(sellerProducts);
      console.log(action.payload);
      sellerProducts[action.payload._id] = action.payload;
      let sellerProductscache = {
        ...state,
        sellerProductsCache: {
          ...state.sellerProductscache,
          [action.payload._id]: action.payload,
        },
      };
      console.log('updated sellerProducts', sellerProductscache);
      return {
        ...state,
        sellerProductsCache: {
          ...state.sellerProductsCache,
          [action.payload._id]: action.payload,
        },
      };
    case actionTypes.products.SET_SELLER_PRODUCTS:
      let spCache = state.sellerProductsCache;
      return {
        ...state,
        sellerProductscache: {
          ...state.sellerProductsCache,
          ...action.payload,
        },
      };
    case actionTypes.products.ADD_PRODUCT:
      return {
        ...state,
        productsCache: {
          ...state.productsCache,
          [action.payload._id]: action.payload,
        },
      };
    case actionTypes.products.UPDATE_PRODUCT:
      return {
        ...state,
        productsCache: {
          ...state.productsCache,
          [action.payload._id]: action.payload,
        },
      };
    case actionTypes.products.ADD_RECENTLY_VIEWED_PRODUCT:
      let rvProducts = state.recentlyViewedProductsCache;
      if (rvProducts && rvProducts[action.payload._id]) {
        rvProducts[action.payload._id] = action.payload;
      }
      return {
        ...state,
        recentlyViewedProductsCache: rvProducts,
      };
    case actionTypes.products.SET_ALL_PRODUCT_TAGS:
      return {
        ...state,
        productTags: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
