import actionTypes from '../constants/newActionTypes';
import { PURGE } from "redux-persist";

var initialState = {
  stores: [],
  userIdToStoreCache: {}
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
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
}