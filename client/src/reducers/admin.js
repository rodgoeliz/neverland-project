import {
	CREATE_PLANT_SUCCESS, 
	CREATE_PRODUCT_SUCCESS,
	CREATE_STORE_SUCCESS,
	CREATE_PRODUCT_TAGS_SUCCESS,
	LOAD_PRODUCT_TAGS_SUCCESS,
	LOAD_USERS_SUCCESS,
	LOAD_PRODUCTS_SUCCESS,
	LOAD_STORES_SUCCESS,
	LOAD_PRODUCT_SUCCESS,
	LOAD_PRODUCT_LOADING,
	UPDATE_PRODUCT_SUCCESS
} from '../constants/actionTypes';

var initialState = {
	isSubmitting: false,
	createdProduct: null,
	createdPlant: null,
	createdStore: null,
	createdTags: null,
	allProductTagsSelectors: [],
	allProductsSelectors: [],
	allStoresSelectors: [],
	allPlantsSelectors: [],
	allProductTags: [],
	allProducts: [],
	allStores: [],
	allPlants: [],
	product: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CREATE_PRODUCT_SUCCESS:
			return {...state, createdProduct: action.payload, isLoading: false};
		case UPDATE_PRODUCT_SUCCESS:
			return {...state, createdProduct: action.payload, isLoading: false};
		case CREATE_PLANT_SUCCESS:
			return {...state, createdPlant: action.payload, isLoading: false}
		case CREATE_STORE_SUCCESS:
			return {...state, createdStore: action.payload, isLoading: false}
		case CREATE_PRODUCT_TAGS_SUCCESS:
			return {...state, createdTags: action.payload, isLoading: false}
		case LOAD_PRODUCT_SUCCESS:
		    let product = action.payload;
		    console.log(product)
		    let transformedProductTags = product.tagIds.map((tag) => {
					return {
						label: tag.title,
						value: tag._id
					}
		    })
		    let transformedStoreSelector = {	
						label: "Store of (" + product.storeId.userId.email + ")", 
						value: product.storeId._id
					}
			if (product.userId) {
				let transformedUserSelector = {
							label: product.userId.name +"(" + product.userId.email+ ")", 
							value: product.userId._id
				}
			    product.userSelector = transformedUserSelector;
			}

		    product.tagSelectors = transformedProductTags;
		    product.storeSelector = transformedStoreSelector;
			return {...state, product: action.payload, isLoading: false};
		case LOAD_PRODUCT_LOADING: 
			return {...state, isLoading: true}
		case LOAD_PRODUCT_TAGS_SUCCESS:
			let tags = action.payload;
			let transformedTags = tags.map(
				(tag) => {
					return {
						label: tag.title,
						value: tag._id
					}});
			return {...state,allProductTags: tags,  allProductTagsSelectors: transformedTags}

		case LOAD_USERS_SUCCESS: 
			let users = action.payload;
			let transformedUsers = users.map(
				(user) => {
					return {
						label: user.name +"(" + user.email+ ")", 
						value: user._id
					}});
			return {...state, allUsers: users, allUsersSelectors: transformedUsers}
		case LOAD_PRODUCTS_SUCCESS: 
			let products = action.payload;
			let transformedProducts = products.map(
				(product) => {
					return {
						label: product.title+"(" + product._id + "}", 
						value: product._id}
					});
			return {...state, allProducts: products, allProductsSelectors: transformedProducts}
		case LOAD_STORES_SUCCESS: 
			let stores = action.payload;
			let transformedStores = stores.map((store) => {
				if (!store.userId) {
					return null;
				}
					return {
						label: "Store of (" + store.userId.email + ")", 
						value: store._id
					}
					});
		    transformedStores = transformedStores.filter((store) => {
		    	return store != null;
		    })
			return {...state, allStores: stores, allStoresSelectors: transformedStores}
		default:
			return state;
	}
}