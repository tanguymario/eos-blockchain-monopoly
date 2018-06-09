var stringUtils = require('./string-utils.js');
var basics = require('./basics');
var executeFunctionSafely = basics.executeFunctionSafely;

var load = function(filePath, callbackSuccess, callbackError) {
  if (stringUtils.isNullOrEmpty(filePath)) {
    executeFunctionSafely(callbackError);
    return;
  }

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', filePath, true);
  xobj.onreadystatechange = (function() {
    if (xobj.readyState == 4) {
      if (xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value 
        // but simply returns undefined in asynchronous mode
        if (stringUtils.isNullOrEmpty(xobj.responseText)) {
          console.error("[JSONUtils] Could not load JSON at: " + filePath);
          executeFunctionSafely(callbackError);
          return;
        }

        try {
          var jsonObject = JSON.parse(xobj.responseText);
        } catch (e) {
          console.error(e);
          executeFunctionSafely(callbackError);
          return;
        }

        executeFunctionSafely(callbackSuccess, jsonObject);
      } else {
        executeFunctionSafely(callbackError);
      }
    }
  });
  xobj.send(null);  
}

module.exports.load = load;