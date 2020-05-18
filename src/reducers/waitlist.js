import {WAITLIST_SUBMIT_SUCCESS, WAITLIST_USER_FETCH_SUCCESS} from '../constants/actionTypes';

var initialState = {
	success:  false,
	message: '',
	waitlistUser: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case WAITLIST_SUBMIT_SUCCESS:
			return {...state, waitlistUser: action.payload};
		case WAITLIST_USER_FETCH_SUCCESS:
			return {...state, waitlistUser: action.payload.user, invitedUsers: action.payload.invitedUsers}
		default:
			return state;
	}
}