import { showMessage } from 'actions/ui';
import actionTypes from 'constants/newActionTypes';
import { UI } from 'constants/ui';
import Api from 'lib/api';

const transformUpdateProfileData = (packageProfileId, input) => {
  const transformedInput = {
    edits: {},
    packageProfileId
  };
  if (input.packageProfileName) {
    transformedInput.edits.title = input.packageProfileName;
  }
  if (input.lengthIn) {
    transformedInput.edits.length = input.lengthIn; 
  }

  if (input.widthIn) {
    transformedInput.edits.width = input.widthIn;
  }

  if (input.heightIn) {
    transformedInput.edits.height = input.heightIn
  }

  if (input.packageType) {
    transformedInput.edits.type = input.packageType;
  }
  return transformedInput
}

export const updatePackageProfile = (packageProfileId, input) => async (dispatch) => {
  try {
    const response = await Api.post(
      `/api/shipping/package-profile/update`, 
      transformUpdateProfileData(packageProfileId, input));
    if (response.data.success) {
      dispatch({
        type: actionTypes.store.UPDATE_PACKAGE_PROFILE,
        payload: response.data.payload
      });
      return response.data.payload;
    }  
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: "Error updating a package profile."
    }));
  } catch (error) {
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: error.message
    }));
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
    } 
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: "Error deleting a package profile."
    }));
  } catch (error) {
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: error.message
    }));
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
    } 
  } catch (error) {
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: error.message
    }));
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
    } 
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: "Error creating a package profile."
    }));
    
  } catch (error) {
    dispatch(showMessage({ 
      type: UI.MESSAGES.ERROR, 
      text: error.message
    }));
  }
};