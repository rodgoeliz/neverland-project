import actionTypes from '../constants/newActionTypes';
import { PURGE } from "redux-persist";

var initialState = {
  stores: [],
  userIdToStoreCache: {},
  packageProfiles: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.store.GET_STORE_FOR_USER: 
      let store = action.payload;
      let userId = store.userId;
      return {
        ...state,
        userIdToStoreCache: {
          ...state.userIdToStoreCache,
          [userId]: store
        }
      }
    case  actionTypes.store.GET_STORES:
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
      let existingPackageProfiles = state.packageProfiles;
      existingPackageProfiles.push(action.payload);
      return {
        ...state,
        packageProfiles: existingPackageProfiles
      }
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
}