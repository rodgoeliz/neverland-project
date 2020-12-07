import actionTypes from '../constants/newActionTypes';
import Api from '../lib/api';

export const getStores = () => async (dispatch) => {
  try {
    const response = await Api.get(`/api/store/get/list`);
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.GET_STORES,
        payload: response.data.payload
      });
    } else {
      console.log("Error retrieving stores...", response.data.error);
    }
  } catch (error) {
    console.log(error);
  }
}