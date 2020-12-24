import {
	WAITLIST_SUBMIT_SUCCESS,
	WAITLIST_USER_FETCH_SUCCESS,
	NEWSLETTER_SUBMIT_SUCCESS
} from 'constants/actionTypes';

const initialState = {
	success: false,
	message: '',
	waitlistUser: {},
	newsletterSubmitSuccess: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case WAITLIST_SUBMIT_SUCCESS:
			return { ...state, waitlistUser: action.payload };
		case WAITLIST_USER_FETCH_SUCCESS:
			return { ...state, waitlistUser: action.payload.user, invitedUsers: action.payload.invitedUsers }
		case NEWSLETTER_SUBMIT_SUCCESS:
			return { ...state, newsletterSubmitSuccess: true }
		default:
			return state;
	}
}