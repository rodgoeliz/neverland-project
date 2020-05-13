import {WAITLIST_SUBMIT_SUCCESS, WAITLIST_USER_FETCH_SUCCESS} from "../constants/actionTypes";

export const joinWaitlist = (email, inviter) => {
	return async (dispatch) => {
		console.log("dispatch payload")
		const response = await fetch('/waitlist/join', {
			headers: {
				"Content-Type":"application/json"
			},
			method: "post",
			body: JSON.stringify({"email": email, "inviter": inviter})
		});
		const body = await response.json();
		dispatch({
			type: WAITLIST_SUBMIT_SUCCESS,
			payload: body
		});
	}
}

export const fetchWaitlistUser = (referralCode) => {
	return async(dispatch) => {
		const response = await fetch('/waitlist/user?referralCode='+referralCode);
		const body = await response.json();
		console.log(body)
		dispatch({
			type: WAITLIST_USER_FETCH_SUCCESS,
			payload: body
		});
	}
}