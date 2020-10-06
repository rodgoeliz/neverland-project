import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import waitlist from "../reducers/waitlist";
import admin from "../reducers/admin";

const store = createStore(
	combineReducers({
		waitlist,
		admin
	}),
	applyMiddleware(thunk)
);

export default store;