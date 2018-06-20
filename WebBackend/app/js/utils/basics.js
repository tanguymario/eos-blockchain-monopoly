var exists = function(o) { return o !== null && o !== undefined; };

var isFunction = function(f) { 
  return f && {}.toString.call(f) === '[object Function]'; 
}
var executeFunctionSafely = function(callback, arg) { 
  if (isFunction(callback)) { 
    callback(arg); 
  } 
}

var getArgOrDefault = function getArgOrDefault(arg, def) { 
  return exists(arg) ? arg : def; 
}

var getPromptString = function(msg, defaultValue) {
  var inputString = undefined;
  while (!exists(inputString) || inputString === "") {
    inputString = prompt(msg, defaultValue);
  }
  return inputString;
}

var isObject = function(o) {
  return typeof o === 'object';
}

var destroyObject = function(o) {
  var oKeys = Object.keys(o);
  var nbOKeys = oKeys.length;
  for (var i = 0; i < nbOKeys; i++) {
    var oKey = oKeys[i];
    if (!isFunction(o[oKey])) {
      o[oKeys[i]] = null;
    }
  }
}

module.exports.exists = exists;
module.exports.isFunction = isFunction;
module.exports.executeFunctionSafely = executeFunctionSafely;
module.exports.getArgOrDefault = getArgOrDefault;
module.exports.getPromptString = getPromptString;
module.exports.isObject = isObject;
module.exports.destroyObject = destroyObject;