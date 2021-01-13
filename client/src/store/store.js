import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import storage from 'redux-persist/lib/storage';

import waitlist from "reducers/waitlist";
import ui from "reducers/ui";
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
  ui,
  waitlist,
  admin,
  auth,
  seller,
  products,
  stores
});

const persistedReducer = persistReducer(persistConfig, rootReducers);
const composeEnhancers = composeWithDevTools({});
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export default { store, persistor };