require('dotenv').config();
module.exports.getEnvVariable = (key) => {
  var env = process.env.NODE_ENV || 'development';
  if (env == 'development') {
    return process.env[`${key}_TEST`];
  } else {
    return process.env[`${key}_LIVE`];
  }
}