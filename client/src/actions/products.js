
import actionTypes from 'constants/newActionTypes';
import Api from 'lib/api';

export const createTestProduct = () => async (dispatch) => {
  dispatch({
    type: actionTypes.products.ADD_TEST_SELLER_PRODUCT,
    payload: {},
  });
};

export const getProductSearchMetaData = () => async (dispatch) => {
  try {
    const response = await Api.get(`/api/product/meta-data/get/list`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.products.GET_PRODUCTS_SEARCH_META_DATA_LIST,
        payload: response.data.payload
      });
    } else {
      // console.log("Error retrieving product search meta data: ", response.data.error)
    }
  } catch (error) {
    // console.log(error);
  }
}

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
      // console.log('Error creating product', response);
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
  }
};

export const loadProductsByTag = ({ limit, offset, tagId }) => async () => {
  try {
    await Api.get(
      `api/product/getMany?tagId=${tagId}&offset=${offset}&limit=${limit}`,
    );

  } catch (error) {
    // console.log(error);
  }
};

export const updateProduct = ({ formData }) => async (dispatch) => {
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
      // console.log('Error updating product', response);
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
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
      // console.log('logRecentlyViewedProduct error', response);
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
  }
};

export const getAllProductTags = () => async (dispatch) => {
  try {
    const response = await Api.get(`api/product/tags/getAll`);

    if (!response.data.success) {
      // console.log('Error in getAllProductTags', response);
    } else {
      dispatch({
        type: actionTypes.products.SET_ALL_PRODUCT_TAGS,
        payload: { ...response.data.payload },
      });
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    const response = await Api.get(`api/product/get?productId=${id}`);

    if (response.data.success) {
      dispatch({
        type: actionTypes.products.UPDATE_PRODUCT,
        payload: response.data.payload,
      });
    } else {
      throw new Error({ message: 'getProductById failed' });
    }
  } catch (error) {
    // throw HandleErrorMessage(error);
  }
};

export const getProductList = () => async (dispatch) => {
  try {
    const response = await Api.get(`api/product/get/list`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.products.GET_PRODUCT_LIST,
        payload: response.data.payload
      })
    } else {
      throw new Error({ message: 'getProductList failed' });
    }
  } catch (error) {
    // console.log("error getting product list: ", error);
  }
}