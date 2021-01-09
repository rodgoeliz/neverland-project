import actionTypes from 'constants/newActionTypes';

import Api from 'lib/api';

export const updateStore = (storeId, formData) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/store/update`, {
      storeId,
      formData
    });
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.UPDATE_STORE,
        payload: response.data.payload
      });
    }
  } catch (error) {
    // console.log(error);
  }
}

export const getStore = (userId) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/store/get?userId=${userId}`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.GET_STORE_FOR_USER,
        payload: response.data.payload
      });
      return response.data.payload;
    }
  } catch (error) {
    // console.log(error)
    // console.log(`Error retrieving store for user id: ${userId}`);
  }
}

export const getStores = () => async (dispatch) => {
  try {
    const response = await Api.get(`/api/store/get/list`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.GET_STORES,
        payload: response.data.payload
      });
    } else {
      // console.log("Error retrieving stores...", response.data.error);
    }
  } catch (error) {
    // console.log(error);
  }
}