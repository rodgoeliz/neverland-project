import actionTypes from '../constants/newActionTypes';
import { PURGE } from "redux-persist";

var initialState = {
  stores: []
}

export default (state = initialState, action) => {
  switch (action.type) {
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