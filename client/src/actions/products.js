
import actionTypes from '../constants/newActionTypes';
import Api from '../lib/api';
//import HandleErrorMessage from '../lib/format-error-messages';
//import { errorMessages } from '../constants/messages';
//import { createErrorAction } from 'src/helpers';

export const createTestProduct = () => async (dispatch) => {
  console.log('inaction');
  dispatch({
    type: actionTypes.products.ADD_TEST_SELLER_PRODUCT,
    payload: {},
  });
};

export const createProduct = ({ formData }) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/product/seller/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      dispatch({
        type: actionTypes.products.ADD_PRODUCT,
        payload: { ...response.data.payload },
      });
      dispatch({
        type: actionTypes.products.ADD_OR_REPLACE_SELLER_PRODUCT,
        payload: { ...response.data.payload },
      });
    } else {
      console.log('Error creating product', response);
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const loadProductsByTag = ({ limit, offset, tagId }) => async (dispatch) => {
  console.log('WARNING! loadProductsByTag does not trigger state change!');
  try {
    const response = await Api.get(
      `api/product/getMany?tagId=${tagId}&offset=${offset}&limit=${limit}`,
    );

    if (!response.data.success) {
      //dispatch(createErrorAction(actionTypes.products.LOAD_PRODUCTS_BY_TAG, response.data.error));
      return;
    }
    const clearCache = offset === 0;
    // dispatch.products.replace(response.data, clearCache);
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const updateProduct = ({ productId, formData }) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/product/seller/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      dispatch({
        type: actionTypes.products.UPDATE_PRODUCT,
        payload: { ...response.data.payload },
      });
      dispatch({
        type: actionTypes.products.ADD_OR_REPLACE_SELLER_PRODUCT,
        payload: { ...response.data.payload },
      });
    } else {
      console.log('Error updating product', response);
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const logRecentlyViewedProduct = ({ productId, userId }) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/product/recentlyviewed/create`, {
      productId,
      userId,
    });

    if (response.data.success) {
      dispatch({
        type: actionTypes.products.ADD_RECENTLY_VIEWED_PRODUCT,
        payload: { ...response.data.payload },
      });
    } else {
      console.log('logRecentlyViewedProduct error', response);
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const getAllProductTags = () => async (dispatch) => {
  try {
    const response = await Api.get(`api/product/tags/getAll`);

    if (!response.data.success) {
      console.log('Error in getAllProductTags', response);
    } else {
      dispatch({
        type: actionTypes.products.SET_ALL_PRODUCT_TAGS,
        payload: { ...response.data.payload },
      });
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    const response = await Api.get(`api/product/get?productId=${id}`);
    console.log('response', response);

    if (response.data.success) {
      dispatch({
        type: actionTypes.products.UPDATE_PRODUCT,
        payload: response.data.payload,
      });
    } else {
      throw new Error({ message: 'getProductById failed' });
    }
  } catch (error) {
    //throw HandleErrorMessage(error);
  }
};
