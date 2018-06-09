var JSONLoader = require('./json-loader.js');
var basics = require('./basics.js');
var executeFunctionSafely = basics.executeFunctionSafely;

class JSONsLoader {
  constructor(options={}) {
    this.isLoading = false;
    this.isFinished = false;
    this.hasFailed = false;
    this.callbackSuccess = options.callbackSuccess;
    this.callbackError = options.callbackError;
    this.callbackOnEachSuccess = options.callbackOnEachSuccess;
    this.callbackOnEachError = options.callbackOnEachError;
    this.stopsOnFailure = options.stopsOnFailure || true;
    
    this._loaders = [];
    this._hasToStop = false;
    this._nbLoadersFinished = 0;
  }

  add(jsonLoader) {
    if (!(jsonLoader instanceof JSONLoader)) {
      console.warn("[JSONsLoader] JSONLoader missing");
      return;
    }

    this._loaders.push(jsonLoader);
  }

  checkIfFinished() {
    if (this._hasToStop) {
      this.isFinished = true;
      this.isLoading = false;
      this.hasFailed = true;
      executeFunctionSafely(this.callbackSuccess);
    } else if (this._nbLoadersFinished == this._loaders.length) {
      this.isFinished = true;
      this.isLoading = false;
      this.hasFailed = false;
      executeFunctionSafely(this.callbackSuccess);
    }
  }

  getNbLoaders() {
    return this._loaders.length;
  }

  load() {
    if (this.isLoading) {
      console.warn("[JSONsLoader] Already loading...");
      return;
    }

    this.isLoading = true;
    
    // Check the first time if there is no files to load
    this.checkIfFinished();

    this._loaders.forEach(
      (function(loader) {
        if (this._hasToStop) {
          return;
        }

        var originalCallbackSuccess = loader.callbackSuccess;
        var originalCallbackError = loader.callbackError;

        loader.callbackSuccess = (function(json) {
          executeFunctionSafely(originalCallbackSuccess, json);
          executeFunctionSafely(this.callbackOnEachSuccess, json);
          this._nbLoadersFinished++;
          this.checkIfFinished();
        }).bind(this);

        loader.callbackError = (function(err) {
          executeFunctionSafely(originalCallbackError, err);
          executeFunctionSafely(this.callbackOnEachError, err);
          this._hasToStop = this.stopsOnFailure;
          this._nbLoadersFinished++;
          this.checkIfFinished();
        }).bind(this);

        loader.load();
      }).bind(this)
    );
  }
}

module.exports = JSONsLoader;