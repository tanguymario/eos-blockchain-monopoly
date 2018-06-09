exists = require('./basics.js').exists;

module.exports.isNullOrEmpty = function(str) {
  return !exists(str) || str === "";
}