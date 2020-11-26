const isDevEnv = process.env.NODE_ENV === 'development';

export default {
  // App Details
  appName: 'Neverland',

  // Build Configuration - eg. Debug or Release?
  isDevEnv,

  // Date Format
  dateFormat: 'Do MMM YYYY',

  // API
  apiBaseUrl: isDevEnv ? 'http://localhost:5000' : 'https:/www.enterneverland.com',
  // apiBaseUrl: isDevEnv ? 'http://192.168.4.76:5000' : 'https://www.enterneverland.com',

  // Google Analytics - uses a 'dev' account while we're testing
};
