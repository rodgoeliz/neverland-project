
import { saveAs } from 'file-saver';

import actionTypes from 'constants/newActionTypes';
import { sellerOnBoardingSteps } from "constants/onBoardingSteps";

import Api from 'lib/api';

import { setUser } from './auth';

const algoliasearch = require('algoliasearch');

const searchClient = algoliasearch('PAPXFJG9H7', '0800ce10f5b7726f39a626cb1c935299');


export const onSubmitStep = ({ stepId, formData, userId }) => async (dispatch) => {
  const response = await Api.post(`/api/seller/onboarding/submit`, {
    stepId,
    formData,
    userId,
  });
  // set user info as well here
  if (!response.data.success) {
    // dispatch(
    // createErrorAction(actionTypes.seller.SUBMIT_SELLER_ONBOARDING_STEP, response.data.error),
    // );
  } else {
    if (stepId === sellerOnBoardingSteps.SIGNUP_BASICS) {
      const { sellerUser, accountLinks } = response.data.payload;
      dispatch({
        type: actionTypes.seller.SET_ACCOUNT_LINKS,
        payload: accountLinks,
      });

      dispatch(setUser(sellerUser));
    }
    if (
      stepId === sellerOnBoardingSteps.SIGNUP_SHOP_BASICS ||
      stepId === sellerOnBoardingSteps.SIGNUP_PAYMENT
    ) {
      dispatch(setUser(response.data.payload));
    }
  }
}

export const getSellerOrders = (sellerId) => async (dispatch) => {
  console.log(sellerId)
  dispatch({
    type: actionTypes.seller.GET_SELLER_PRODUCTS,
    payload: {}
  })
}

export const getSellerProducts = (sellerId) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/products/get/list?userId=${sellerId}`)
    console.log("LOAD SELLER PRODUCTS: ", response)
    dispatch({
      type: actionTypes.products.SET_SELLER_PRODUCTS,
      payload: response.data.payload
    });
    dispatch({
      type: actionTypes.seller.GET_SELLER_PRODUCTS,
      payload: response.data.payload
    });
  } catch (error) {
    console.log(error);
  }
}

export const getSellerAccountLinks = ({ sellerId }) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/account-links/get?sellerId=${sellerId}&source=web`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.seller.SET_ACCOUNT_LINKS,
        payload: response.data.payload,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const clearSellerCurrentProductCache = () => ({
  type: actionTypes.seller.CLEAR_CURRENT_PRODUCT,
});

export const setCurrentProduct = (product) => ({
  type: actionTypes.seller.SET_CURRENT_PRODUCT,
  payload: { ...product },
});

export const updateProduct = (product) => ({
  type: actionTypes.seller.UPDATE_PRODUCT,
  payload: { ...product },
});

export const setAllProducts = (products) => ({
  type: actionTypes.seller.SET_CURRENT_PRODUCT,
  payload: [...products],
});

export const setAllProductCategories = (categories) => ({
  type: actionTypes.seller.SET_ALL_PRODUCT_CATEGORIES,
  payload: [...categories],
});

export const setAllProductTags = (tags) => ({
  type: actionTypes.seller.SET_ALL_PRODUCT_TAGS,
  payload: [...tags],
});
export const clearTagsAndCategories = () => async (dispatch) => {
  dispatch({
    type: actionTypes.seller.CLEAR_TAGS_AND_CATEGORIES,
  });
};

export const loadAllProductCategories = () => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/product/categories/get`);

    if (response.data.success) {
      dispatch(setAllProductCategories(response.data.payload));
    } else {
      // handle error message
      console.log('loadAllProductCategories error', response);
    }
  } catch (error) {
    console.log('loadAllProductCategories', error)
    // throw HandleErrorMessage(error);
  }
};

export const loadAllProductTags = () => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/product/tags/get`);


    if (response.data.success) {
      dispatch(setAllProductTags(response.data.payload));
    } else {
      //  handle error message
      console.log('loadAllProductTags error', response);
    }
  } catch (error) {
    console.log(error)
  }
};

export const loadSellerProduct = ({ productId }) => async (dispatch, getState) => {
  const state = getState();
  try {
    if (
      state.productsCache &&
      state.productsCache.includes((product) => product.productId === productId)
    ) {
      const product = state.productsCache.find((productCached) => productCached.productId === productId);
      dispatch(setCurrentProduct(product));

      return product;
    }

    const response = await Api.get(`/api/seller/products/get?productId=${productId}`);
    if (response.data.success) {
      dispatch(setCurrentProduct(response.data.payload));
      return response.data.payload;
    }
  } catch (error) {
    console.log('//error getting productid', error)
    // throw HandleErrorMessage(error);
  }
};

export const checkSellerPaymentOnBoardingStatus = ({ stripeId }) => async () => {
  try {
    await Api.get(`/api/seller/onboarding/getPaymentStatus?stripeId=${stripeId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getProductsForSeller = ({ sellerId }) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/products/getAll?userId=${sellerId}`);

    if (response.data.success) {
      dispatch(setAllProducts(response.data.payload));
    } else {
      console.log('getProductsForSeller ERROR', response);
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
  }
};

export const toggleVisibility = (productId, isVisible) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/product/toggleVisibility`, {
      productId,
      isVisible
    });

    if (response.data.success) {
      dispatch(updateProduct(response.data.payload));
    }
  } catch (error) {
    console.log(error);
  }
};

export const clearAccountLinks = () => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.seller.CLEAR_ACCOUNT_LINKS,
    });
  } catch (error) {
    console.log(error);
  }
};


export const changeSellerPage = (page) => (dispatch) => {
  dispatch({
    type: actionTypes.seller.CHAHGE_SELLER_PRODUCTS_PAGE,
    payload: page
  });
};

export const getOrderById = (orderId) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/order/get?id=${orderId}`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.seller.UPDATE_SINGLE_ORDER,
        payload: response.data.payload
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const getAlgoliaSearchClient = () => {
  return searchClient;
}

export const getAlgoliaSellerOrderIndex = () => {
  console.log('node_env', process.env.NODE_ENV === 'development', (!process.env.NODE_ENV || process.env.NODE_NEV === 'development'))
  if (!process.env.NODE_ENV) {
    return 'neverland_order_test';
  }
  if (process.env.NODE_ENV === 'development') {
    return 'neverland_order_test';
  }
  return 'neverland_order_prod';
}

export const getAlgoliaSellerProductIndex = () => {
  console.log('node_env', process.env.NODE_ENV === 'development', (!process.env.NODE_ENV || process.env.NODE_NEV === 'development'))
  if (!process.env.NODE_ENV) {
    return 'dev_neverland_products';
  }
  if (process.env.NODE_ENV === 'development') {
    return 'dev_neverland_products';
  }
  return 'neverland_products_prod';
}


export const createOrderPdf = ({ orderId, products, currentOrder }) => async () => {
  try {
    // Create file
    const response = await Api.post(`/api/order/order-pdf?id=${orderId}`, {
      orderId,
      products,
      currentOrder,
      responseType: 'blob'
    });

    if (response.status === 200) {
      // Download file
      const orderFile = await Api.get(`/api/order/order-pdf?id=${orderId}`, {
        name: 'BOB',
        responseType: 'blob'
      });

      const orderPdf = new Blob(
        [orderFile.data],
        { type: 'application/pdf' }
      );

      saveAs(orderPdf, 'order.pdf');

      // Delete order from backend
      Api.delete(`/api/order/order-pdf?id=${orderId}`);
    }

  } catch (error) {
    console.log(error);
  }
}
