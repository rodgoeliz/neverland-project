const Sentry = require('@sentry/node');

module.exports.logError = function(error) {
  Sentry.captureException(error);
}

module.exports.logInfo = function(message) {
  Sentry.captureMessage(message, 'info');
}