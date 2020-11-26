import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import waitlist from "../reducers/waitlist";
import admin from "../reducers/admin";
import auth from "../reducers/auth";
import seller from "../reducers/seller";
import products from "../reducers/products";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage
}

const rootReducers =  combineReducers({
    waitlist,
    admin,
    auth,
    seller,
    products
  });
const persistedReducer = persistReducer(persistConfig, rootReducers)
const store = createStore(
  persistedReducer,
	applyMiddleware(thunk)
);
const persistor = persistStore(store);

export default {store, persistor};