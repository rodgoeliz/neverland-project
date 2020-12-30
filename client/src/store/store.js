import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import storage from 'redux-persist/lib/storage';

import waitlist from "reducers/waitlist";
import admin from "reducers/admin";
import auth from "reducers/auth";
import seller from "reducers/seller";
import products from "reducers/products";
import stores from 'reducers/store';

const persistConfig = {
  key: 'root',
  storage
}

const rootReducers = combineReducers({
  waitlist,
  admin,
  auth,
  seller,
  products,
  stores
});
const persistedReducer = persistReducer(persistConfig, rootReducers)
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);
const persistor = persistStore(store);

export default { store, persistor };