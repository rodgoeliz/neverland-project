import { PURGE } from "redux-persist";

import actionTypes from 'constants/newActionTypes';

const initialState = {
  stores: [],
  userIdToStoreCache: {}
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
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
}