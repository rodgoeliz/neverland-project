import { sellerOnBoardingSteps, userOnBoardingSteps } from 'constants/onBoardingSteps';
import screenNames from 'constants/screenNames';

export const getNextOnBoardingStepId = (lastCompletedStepId, isSeller = false) => {
  console.log('getNextOnBoardingStepId lastCompletedStepId', lastCompletedStepId, isSeller);
  if (isSeller) {
    switch (lastCompletedStepId) {
      case sellerOnBoardingSteps.SIGNUP_START:
        return sellerOnBoardingSteps.SIGNUP_BASICS;
      case sellerOnBoardingSteps.SIGNUP_BASICS:
        return sellerOnBoardingSteps.SIGNUP_SHOP_BASICS;
      case sellerOnBoardingSteps.SIGNUP_SHOP_BASICS:
        return sellerOnBoardingSteps.SIGNUP_ADD_PRODUCTS;
      case sellerOnBoardingSteps.SIGNUP_ADD_PRODUCTS:
        return sellerOnBoardingSteps.SIGNUP_PAYMENT;
      case sellerOnBoardingSteps.SIGNUP_PAYMENT: // both cases since
      case sellerOnBoardingSteps.SIGNUP_PENDING_ACTIVATION: // activation is the last step
        return sellerOnBoardingSteps.SIGNUP_PENDING_ACTIVATION;
      default:
        return '';
    }
  } else {
    switch (lastCompletedStepId) {
      case userOnBoardingSteps.SIGNUP_START:
        return userOnBoardingSteps.SIGNUP_BASICS;
      case userOnBoardingSteps.SIGNUP_BASICS:
        return userOnBoardingSteps.SIGNUP_PERSONALIZATION;
      case userOnBoardingSteps.SIGNUP_PERSONALIZATION: // both cases since
      case userOnBoardingSteps.SIGNUP_NOTIFICATIONS: // notifications is the last step
        return userOnBoardingSteps.SIGNUP_NOTIFICATIONS;
      default:
        return '';
    }
  }
};

export const getScreenName = (onBoardingStepId) => {
  switch (onBoardingStepId) {
    case userOnBoardingSteps.SIGNUP_BASICS:
      return screenNames.HomeMainSignupBasics;
    case userOnBoardingSteps.SIGNUP_PERSONALIZATION:
      return screenNames.HomeMainSignupPersonalization;
    case userOnBoardingSteps.SIGNUP_NOTIFICATIONS:
      return screenNames.HomeMainSignupNotification;
    case sellerOnBoardingSteps.SIGNUP_START:
      return screenNames.SellerSignupStart;
    case sellerOnBoardingSteps.SIGNUP_BASICS:
      return screenNames.SellerOnBoardingBasics;
    case sellerOnBoardingSteps.SIGNUP_SHOP_BASICS:
      return screenNames.SellerOnBoardingShopInfo;
    case sellerOnBoardingSteps.SIGNUP_ADD_PRODUCTS:
      return screenNames.SellerOnBoardingAddProducts;
    case sellerOnBoardingSteps.SIGNUP_PAYMENT:
      return screenNames.SellerOnBoardingPayment;
    case sellerOnBoardingSteps.SIGNUP_PENDING_ACTIVATION:
      return screenNames.SellerOnBoardingPendingActivation;
    default:
      return screenNames.HomeMainSignupBasics;
  }
};

export const formatPrice = (price, currency) =>
  (price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
