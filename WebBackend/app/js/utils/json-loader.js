var jsonUtils = require('./json-utils.js');
var basics = require('./basics.js');
var executeFunctionSafely = basics.executeFunctionSafely;

class JSONLoader {
  constructor(filePath, options={}) {
    this.filePath = filePath;
    this.isFinished = false;
    this.hasFailed = false;
    this.keepData = options.keepData || false;
    this.callbackSuccess = options.callbackSuccess;
    this.callbackError = options.callbackError;

    this._data = null;
  }

  getData() {
    return this._data;
  }

  clean() {
    this._data = null;
  }

  load() {
    var callbackSuccess = this.callbackSuccess;
    var callbackError = this.callbackError;

    jsonUtils.load(this.filePath, 
      (function(json) {
        this.isFinished = true;
        this.hasFailed = false;
        if (this.keepData) {
          this._data = json;
        }
        executeFunctionSafely(callbackSuccess, json);
      }).bind(this),

      (function(err) {
        this.isFinished = true;
        this.hasFailed = true;
        executeFunctionSafely(callbackError, err);
      }).bind(this)
    );
  }
}

module.exports = JSONLoader;