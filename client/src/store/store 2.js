import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import waitlist from "reducers/waitlist";

const store = createStore(
	combineReducers({
		waitlist
	}),
	applyMiddleware(thunk)
);

export default store;