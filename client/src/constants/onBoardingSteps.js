export const userOnBoardingSteps = {
  SIGNUP_START: 'signup_start',
  SIGNUP_BASICS: 'signup_basics',
  SIGNUP_PERSONALIZATION: 'signup_personalization',
  SIGNUP_NOTIFICATIONS: 'signup_notifications',
};

export const sellerOnBoardingSteps = {
  SIGNUP_START: 'signup_start',
  LOGIN_START: 'login_start',
  SIGNUP_BASICS: 'seller_signup_basics',
  SIGNUP_SHOP_BASICS: 'seller_signup_shop_basics',
  SIGNUP_PAYMENT: 'seller_signup_payment',
  SIGNUP_ADD_PRODUCTS: 'seller_signup_add_products',
  SIGNUP_SHIPPING: 'seller_signup_shipping_preference',
  SIGNUP_PENDING_ACTIVATION: 'seller_signup_pending_activation',
  MAIN_AUTH: 'seller_main_auth'
};

export const sellerOnBoardingStepsToPath = {
 [sellerOnBoardingSteps.SIGNUP_START] : '/seller/onboarding/signup' ,
 [sellerOnBoardingSteps.LOGIN_START] : '/seller/onboarding/login' ,
 [sellerOnBoardingSteps.SIGNUP_BASICS] : '/seller/onboarding/basics',
 [sellerOnBoardingSteps.SIGNUP_SHOP_BASICS] : '/seller/onboarding/shop',
 [sellerOnBoardingSteps.SIGNUP_PAYMENT] : '/seller/onboarding/payment',
 [sellerOnBoardingSteps.SIGNUP_SHIPPING] : '/seller/onboarding/shipping',
 [sellerOnBoardingSteps.SIGNUP_ADD_PRODUCTS] : '/seller/onboarding/products',
 [sellerOnBoardingSteps.SIGNUP_PENDING_ACTIVATION] : '/seller/onboarding/activation-pending',
 [sellerOnBoardingSteps.MAIN_AUTH] : '/seller/onboarding/auth'
}