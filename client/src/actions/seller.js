import actionTypes from '../constants/newActionTypes';
import { sellerOnBoardingSteps } from "../constants/onBoardingSteps";
import HandleErrorMessage from '../utils/format-error-messages';
import { setUser } from './auth';
import Api from '../lib/api';

export const onSubmitStep = ({ stepId, formData, userId }) => async (dispatch) => {
    const response = await Api.post(`/api/seller/onboarding/submit`, {
      stepId,
      formData,
      userId,
    });
    // set user info as well here
    if (!response.data.success) {
      //dispatch(
        //createErrorAction(actionTypes.seller.SUBMIT_SELLER_ONBOARDING_STEP, response.data.error),
      //);
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

export const launchAppReAuth = (email, inviter) => {
	return async (dispatch) => {

	}
}


export const getSellerAccountLinks = ({ sellerId }, props) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/account-links/get?sellerId=${sellerId}&source=web`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.seller.SET_ACCOUNT_LINKS,
        payload: response.data.payload,
      });
    } else {
      //dispatch(createErrorAction(actionTypes.seller.SET_ACCOUNT_LINKS, response.data.error));
    }
  } catch (error) {
    //dispatch(createErrorAction(actionTypes.seller.SET_ACCOUNT_LINKS, error));
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

export const loadAllProductCategories = (input) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/product/categories/get`);

    if (response.data.success) {
      dispatch(setAllProductCategories(response.data.payload));
    } else {
      //handle error message
      console.log('loadAllProductCategories error', response);
    }
  } catch (error) {
    console.log('loadAllProductCategories', error)
    //throw HandleErrorMessage(error);
  }
};

export const loadAllProductTags = (input) => async (dispatch) => {
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
      let product = state.productsCache.find((product) => product.productId === productId);
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
    //throw HandleErrorMessage(error);
  }
};

export const checkSellerPaymentOnBoardingStatus = ({ stripeId }) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/seller/onboarding/getPaymentStatus?stripeId=${stripeId}`);

  } catch (error) {
    //throw HandleErrorMessage(error);
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
    //throw HandleErrorMessage(error);
  }
};

export const toggleVisibility = ({ productId }) => async (dispatch) => {
  try {
    dispatch.seller.toggleProductVisibility(productId);
    const response = await Api.post(`/api/product/toggleVisibility`, {
      productId,
    });
    if (response.data.success) {
      dispatch(updateProduct(response.data.payload));
    } else {
      //dispatch(createErrorAction(actionTypes.seller.TOGGLE_VISIBILITY, response.data.error));
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const clearAccountLinks = () => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.seller.CLEAR_ACCOUNT_LINKS,
    });
  } catch (error) {}
};


