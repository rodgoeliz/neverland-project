import actionTypes from '../constants/newActionTypes';
import Api from '../lib/api';

export const updatePackageProfile = (packageProfileId, input) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/shipping/package-profile/update`, {packageProfileId, input});
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.UPDATE_PACKAGE_PROFILE,
        payload: response.data.payload
      });
      return response.data.payload;
    } else {
      console.log("error updatin profile")
    }
  } catch (error) {
    console.log("error updating profile: ", error)
  }
}

export const deletePackageProfile = (packageProfileId) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/shipping/package-profile/delete`, {packageProfileId});
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.DELETE_PACKAGE_PROFILE,
        payload: response.data.payload
      });
      return response.data.payload;
    } else {
      console.log("error deleting package..");
    }
  } catch (error) {
    console.log("Error deleting package profile", error);
  }
}

export const loadPackageProfiles = (storeId) => async (dispatch) => {
  try {
    const response = await Api.get(`/api/shipping/package-profile/get/list?storeId=${storeId}`);
    console.log("load package profiles response: ", response)
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.LOAD_PACKAGE_PROFILES,
        payload: response.data.payload
      });
      return response.data.payload;
    } else {
      console.log("error loading package profiles...")
    }
  } catch (error) {
    console.log("Loading package profiles ahs failed: ", error);
  }
}

export const createPackageProfile = (input) => async (dispatch) => {
  try {
    const response = await Api.post(`/api/shipping/package-profile/create`, input);
    console.log("creat epackage profile r4esponse: ", input, response)
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.ADD_PACKAGE_PROFILE,
        payload: {...response.data.payload}
      });
      return response.data.payload;
    } else {
      console.log("error creating a package profile");
    }
  } catch (error) {
    console.log("error creating package profile", error);
  }
};