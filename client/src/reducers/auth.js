import actionTypes from '../constants/newActionTypes';
import { getNextOnBoardingStepId } from '../utils/helpers';

export const initialState = {
  avatarURL: '',
  createdAt: '',
  email: '',
  facebookId: '',
  firebaseUID: '',
  isProfileComplete: false,
  level: '',
  locations: [],
  name: '',
  onboardingStepId: '',
  phoneNumber: '',
  plantInterests: [],
  plantRequirements: [],
  storeId: {},
  stripeCustomerId: '',
  isAuthorized: false,
  isInitialLoginFinished: false,
  updatedAt: '',
  zipCode: '',
  __v: 0,
  _id: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.auth.SET_USER:
      let isSeller = action.payload.isSeller;
      return {
        ...state,
        ...action.payload,
        // set next onboardingStepId only if action.payload carries it
        onboardingStepId:
          getNextOnBoardingStepId(action.payload.onboardingStepId, isSeller) ||
          state.onboardingStepId,
      };
    case actionTypes.auth.SET_IS_AUTHORIZED:
      return {
        ...state,
        isAuthorized: action.payload,
      };
    case actionTypes.auth.SET_IS_PROFILE_COMPLETE:
      return {
        ...state,
        isProfileComplete: action.payload,
      };
    case actionTypes.auth.SET_INITIAL_LOGIN_FINISHED:
      return {
        ...state,
        isInitialLoginFinished: action.payload,
      };
    case actionTypes.auth.SET_ONBOARDING_STEP_ID:
      return {
        ...state,
        onboardingStepId: action.payload,
      };
    case actionTypes.auth.LOGOUT:
      return {
        ...initialState,
        isInitialLoginFinished: true,
      };
    default:
      return state;
  }
};

export default authReducer;
