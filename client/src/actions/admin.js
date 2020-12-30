import {
	CREATE_PLANT_SUCCESS,
	CREATE_PRODUCT_SUCCESS,
	CREATE_STORE_SUCCESS,
	CREATE_PRODUCT_TAGS_SUCCESS,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_LOADING,
	LOAD_PRODUCT_TAGS_SUCCESS,
	LOAD_PRODUCTS_SUCCESS,
	LOAD_USERS_SUCCESS,
	LOAD_STORES_SUCCESS,
	LOAD_PRODUCT_SUCCESS,
	LOAD_PRODUCT_LOADING,
	UPDATE_PRODUCT_SUCCESS,
	UPLOAD_PRODUCT_FILES_SUCCESS,
	UPLOAD_STORE_FILES_SUCCESS
} from "constants/actionTypes";


export const handleClickCreateNavigation = () => {
	console.log("handle press create navigation")
	return async () => {
		const response = await fetch('/api/navigation/upload/file', {
			method: "post"
		})
		const body = await response.json();
		console.log("response")
		console.log(body)
	}
}

export const loadProduct = (productId) => async (dispatch) => {
	dispatch({
		type: LOAD_PRODUCT_LOADING
	});
	const response = await fetch(`/api/product/get?productId=${productId}`);
	const body = await response.json();
	dispatch({
		type: LOAD_PRODUCT_SUCCESS,
		payload: body
	});
}

export const createProductTags = (input) => async (dispatch) => {
	const response = await fetch('/api/product/tags/create', {
		headers: {
			"Content-Type": "application/json"
		},
		method: "post",
		body: JSON.stringify(input)
	});
	const body = await response.json();
	dispatch({
		type: CREATE_PRODUCT_TAGS_SUCCESS,
		payload: body
	});
};

export const deleteProduct = (productId) => async (dispatch) => {
	dispatch({
		type: DELETE_PRODUCT_LOADING
	});
	const response = await fetch('/api/product/delete', {
		headers: {
			"Content-Type": "application/json"
		},
		method: 'post',
		body: JSON.stringify({ productId })
	});
	const body = await response.json();
	dispatch({
		type: DELETE_PRODUCT_SUCCESS,
		payload: body
	});
}

/**
  Must specify files and file type "type"
  * */
export const uploadStoreFiles = (formDataInput) => async (dispatch) => {
	const response = await fetch('/api/store/upload/file', {
		method: "post",
		body: formDataInput
	});
	const body = await response.json();
	dispatch({
		type: UPLOAD_STORE_FILES_SUCCESS,
		payload: body
	});
}
/**
  Must specify files and file type "type"
  * */
export const uploadProductFiles = (formDataInput) => async (dispatch) => {
	const response = await fetch('/api/product/upload/file', {
		method: "post",
		body: formDataInput
	});
	const body = await response.json();
	dispatch({
		type: UPLOAD_PRODUCT_FILES_SUCCESS,
		payload: body
	});
}

export const updateProduct = (formDataInput) => async (dispatch) => {
	const response = await fetch('/api/product/update', {
		method: "post",
		body: formDataInput
	});
	const body = await response.json();
	dispatch({
		type: UPDATE_PRODUCT_SUCCESS,
		payload: body
	});
}

export const createProduct = (input) => async (dispatch) => {
	const response = await fetch('api/product/create', {
		method: "post",
		body: input
	});
	const body = await response.json();
	dispatch({
		type: CREATE_PRODUCT_SUCCESS,
		payload: body
	});
}

export const createStore = (storeInput) => async (dispatch) => {
	const response = await fetch('/api/store/create', {
		headers: {
			"Content-Type": "application/json"
		},
		method: "post",
		body: JSON.stringify(storeInput)
	});
	const body = await response.json();
	dispatch({
		type: CREATE_STORE_SUCCESS,
		payload: body
	});
}

export const createPlant = (email, inviter) => async (dispatch) => {
	const response = await fetch('api/plant/create', {
		headers: {
			"Content-Type": "application/json"
		},
		method: "post",
		body: JSON.stringify({ "email": email, "inviter": inviter })
	});
	const body = await response.json();
	dispatch({
		type: CREATE_PLANT_SUCCESS,
		payload: body
	});
}

export const loadProducts = () => async (dispatch) => {
	const response = await fetch('/api/product/all');
	const body = await response.json();
	dispatch({
		type: LOAD_PRODUCTS_SUCCESS,
		payload: body
	});
}

export const loadStores = () => async (dispatch) => {
	const response = await fetch('/api/store/all');
	const body = await response.json();
	dispatch({
		type: LOAD_STORES_SUCCESS,
		payload: body
	});
}

export const loadUsers = () => async (dispatch) => {
	const response = await fetch('/api/user/all');
	const body = await response.json();
	dispatch({
		type: LOAD_USERS_SUCCESS,
		payload: body
	});
}

export const loadProductTags = () => async (dispatch) => {
	const response = await fetch('/api/product/tags/all');
	const body = await response.json();
	dispatch({
		type: LOAD_PRODUCT_TAGS_SUCCESS,
		payload: body
	});
}

export const getPlants = (email, inviter) => async (dispatch) => {
	const response = await fetch('/plant/all', {
		headers: {
			"Content-Type": "application/json"
		},
		method: "post",
		body: JSON.stringify({ "email": email, "inviter": inviter })
	});
	const body = await response.json();
	dispatch({
		type: CREATE_PLANT_SUCCESS,
		payload: body
	});
}
