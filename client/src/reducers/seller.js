import { PURGE } from "redux-persist";

import actionTypes from 'constants/newActionTypes';

export const initialState = {
  accountLinks: {},
  currentProduct: {},
  productsCache: [],
  allProductTags: [],
  allProductCategories: [],
};

const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.seller.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
      };
    case actionTypes.seller.GET_SELLER_PRODUCTS:
      return {
        ...state,
        productsCache: action.payload
      };
    case actionTypes.seller.SET_ALL_PRODUCTS:
      return {
        ...state,
        productsCache: action.payload,
      };
    case actionTypes.seller.CLEAR_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: {},
      };
    case actionTypes.seller.UPDATE_PRODUCT:
      return {
        ...state,
        productsCache: state.productsCache.map((product) =>
          product._id === action.payload._id ? action.payload : product,
        ),
      };
    case actionTypes.seller.CLEAR_ACCOUNT_LINKS:
      return {
        ...state,
        accountLinks: {},
      };
    case actionTypes.seller.SET_ACCOUNT_LINKS:
      return {
        ...state,
        accountLinks: action.payload,
      };
    case actionTypes.seller.CLEAR_TAGS_AND_CATEGORIES:
      return {
        ...state,
        allProductCategories: [],
        allProductTags: [],
      };
    case actionTypes.seller.SET_ALL_PRODUCT_CATEGORIES:
      return {
        ...state,
        allProductCategories: action.payload,
      };
    case actionTypes.seller.SET_ALL_PRODUCT_TAGS:
      return {
        ...state,
        allProductTags: action.payload,
      };
    case PURGE:
      return { ...initialState };
    default:
      return state;
  }
};

export default sellerReducer;
