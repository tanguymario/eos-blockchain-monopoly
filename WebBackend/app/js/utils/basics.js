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

module.exports.exists = exists;
module.exports.isFunction = isFunction;
module.exports.executeFunctionSafely = executeFunctionSafely;
module.exports.getArgOrDefault = getArgOrDefault;