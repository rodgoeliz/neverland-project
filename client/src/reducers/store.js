import { PURGE } from "redux-persist";

import actionTypes from 'constants/newActionTypes';

const initialState = {
  stores: [],
  userIdToStoreCache: {},
  packageProfiles: [],
  currentStore: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.store.GET_STORE_FOR_USER:
      const store = action.payload;
      const { userId } = store;
      return {
        ...state,
        userIdToStoreCache: {
          ...state.userIdToStoreCache,
          [userId]: store
        }
      }
    case actionTypes.store.GET_STORES:
      return {
        ...state,
        stores: action.payload
      }
    case actionTypes.store.LOAD_PACKAGE_PROFILES:
      return {
        ...state,
        packageProfiles: action.payload
      }
    case actionTypes.store.ADD_PACKAGE_PROFILE:
      const existingPackageProfiles = state.packageProfiles;
      existingPackageProfiles.push(action.payload);
      return {
        ...state,
        packageProfiles: existingPackageProfiles
      }
    case actionTypes.store.UPDATE_PACKAGE_PROFILE:
      const filteredProfiles = state.packageProfiles.filter(profile => profile._id !== action.payload._id);
      filteredProfiles.push(action.payload);
      return {
        ...state,
        packageProfiles: filteredProfiles
      }
    case actionTypes.store.UPDATE_SHIPPING_PREFERENCE:
      return {
        ...state,
        currentStore: action.payload
      }
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
}