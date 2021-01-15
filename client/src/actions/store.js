import actionTypes from 'constants/newActionTypes';
import { showMessage } from 'actions/ui';
import { UI } from 'constants/ui';

import Api from 'lib/api';

export const setCurrentStore = (store) => ({
  type: actionTypes.store.SET_CURRENT_STORE,
  payload: store
});

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
    } else {
      dispatch(showMessage({
        type: UI.MESSAGES.ERROR,
        text: response.data.error
      }));
    }
  } catch (error) {
    dispatch(showMessage({
      type:  UI.MESSAGES.ERROR,
      text: error.message
    }));
  }
}

export const updateShippingPreference = (storeId, shippingPreference) => async (dispatch) => {
  console.log("updateShipping preference")
  try {
    const response = await Api.post(`/api/store/shipping/update`, {
      storeId,
      shippingPreference
    });
    if (response.data.success) {
      console.log("response data success")
      dispatch({
        type: actionTypes.store.UPDATE_SHIPPING_PREFERENCE,
        payload: response.data.payload
      });
    } else {
      console.log("response data fail", response.data)
      dispatch(showMessage({
        type: UI.MESSAGES.ERROR,
        text: response.data.error
      }));
    }
    return response.data.success;
  } catch (error) {
    console.log("ERROR: ", error)
    dispatch(showMessage({
      type:  UI.MESSAGES.ERROR,
      text: error.message
    }));
    return false;
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