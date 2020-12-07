import actionTypes from '../constants/newActionTypes';
import Api from '../lib/api';
import {auth} from '../services/firebase';
import firebase from 'firebase';
import store from '../store/store';
/**
 * Transform the endpoint data structure into our redux store format
 * @param {obj} data
 * @param {string} type
 */
const transformData = (data, type) => {
  switch (type) {
    case 'facebook':
      return {
        facebookId: data.id || 0,
        name: data.name ? data.name : '',
        email: data.email ? data.email : '',
        avatarURL: data.avatar ? data.avatar : '',
        isSeller: data.isSellerOnboarding,
        defaultLogin: 'facebook',
      };
    case 'default':
      return {
        email: data.email,
        password: data.password,
        isSeller: data.isSellerOnboarding,
      };
    default:
      return data;
  }
};

export const setUser = (user) => ({
  type: actionTypes.auth.SET_USER,
  payload: { ...user }
});

export const setIsAuthorized = (payload) => ({
  type: actionTypes.auth.SET_IS_AUTHORIZED,
  payload,
});

export const setIsProfileComplete = (payload) => ({
  type: actionTypes.auth.SET_IS_PROFILE_COMPLETE,
  payload,
});

export const setInitialLoginFinished = (payload) => ({
  type: actionTypes.auth.SET_INITIAL_LOGIN_FINISHED,
  payload,
});

export const setOnBoardingStepId = (payload) => ({
  type: actionTypes.auth.SET_ONBOARDING_STEP_ID,
  payload,
});

export const logoutFirebase = () => async (dispatch) => {
  try {
    await auth().signOut();
    await store.persistor.purge();
    // don't forget to reset mixpanel user
    //await Mixpanel.reset();
  } catch (error) {
    console.log('Error in logoutFirebase', error.message);
  }

  dispatch({ type: actionTypes.auth.LOGOUT });
};


export const loginFirebase = (data) => async (dispatch) => {
  const { email, password } = data;
  console.log("loginFirebase")
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);

    if (result && result.user) {
      try {
        const response = await Api.get(`/api/user/get?email=${email}`);
        console.log("loginFirebase", response)
        if (response.data.success) {
          dispatch(setUser(response.data.payload));
          dispatch(setIsAuthorized(true));

          return {
            success: true,
            data: response.data.payload,
          };
        }

        return {
          success: false,
          data: 'auth/user-not-found',
        };
      } catch (error) {
        console.log('Error in loginFirebase (backend-related)', error.message);

        return {
          success: false,
          data: 'auth/user-not-found',
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      data: error.code,
    };
  }
};

export const onSignUpFirebase = (data, type) => async (dispatch) => {
  const transformedData = transformData(data, type);
  console.log("onSignUpFirebase action", transformedData)
  try {
    if (type === 'default') {
      const firebaseResponse = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password,
      );
      const firebaseUID = firebaseResponse.user.uid;
      console.log("firebaseUID", firebaseUID)
      if (!firebaseUID || firebaseUID === '') {
        throw new Error({ message: 'Failed to create a firebase user' });
      }

      transformedData.firebaseUID = firebaseUID;
      // create a user in our backend with firebase uid and input data.
      const response = await Api.post(`api/user/signup`, transformedData);
      console.log("sign up in our backend", response)
      if (response.data.success) {
        console.log(11111, firebaseUID, response.data.data);
        // identify Mixpanel
        {/*await Mixpanel.identify(`${firebaseUID}`);

        await Mixpanel.set({
          $email: data.email,
          // add more props here
        });*/}
        console.log("SETTING USER", response.data.data)
        dispatch(setUser(response.data.data));
        dispatch(setIsAuthorized(true));
        return response.data.data;
      } else {
        throw new Error({
          message: 'Failed to create a user in our backend.',
        });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};
