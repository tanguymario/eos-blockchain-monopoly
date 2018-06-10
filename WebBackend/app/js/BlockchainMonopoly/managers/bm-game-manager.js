var store = require('store');

var KonvaImages = require('../../utils/konva-images.js');
var JSONsLoader = require('../../utils/jsons-loader.js');
var BlockchainInterface = require('../backend/blockchain-interface.js');

var BMPlayer = require('../data-classes/bm-player.js');

var BMMapLayer = require('../layers/bm-map-layer.js');
var BMGameLayers = require('../layers/bm-game-layers.js');
var BMUILayer = require('../layers/bm-ui-layer.js');
var BMUIActionsLayer = require('../layers/bm-ui-actions-layer.js');
var BMUIHelpLayer = require('../layers/bm-ui-help-layer.js');

var TimeManager = require('./time-manager.js');

class BMGameManager {
  constructor(stage, eventsManager) {
    this.stage = stage;
    this.eventsManager = eventsManager;

    this._konvaImages = new KonvaImages();
    this._jsonsLoader = new JSONsLoader();
    this._jsonsLoaders = [];

    this.layers = {
      map: null,
      game: null,
      ui: null,
      uiActions: null,
      uiHelp: null
    };

    this.blockchainInterface = new BlockchainInterface();

    this.player = null;

    this.refreshIntervalId = null;
    this.refreshTime = 15000;

    this.initialize();
  }

  initialize() {
    this.player = new BMPlayer(this);

    this.createLayers();
    this.initializeLayers();
    this.preload();
  }

  preload() {
    // Call preload for every layer
    this.layersArray.forEach(
      (function(layer) {
        layer.preload();
      }).bind(this)
    );

    // Check for the end of loading and launch start
    var checkPreloadFinished = 
    (function() {
      // Check for jsonsLoaders
      var nbJSONsLoaders = this._jsonsLoaders.length;
      for (var i = 0; i < nbJSONsLoaders; i++) {
        if (!this._jsonsLoaders[i].isFinished) {
          return;
        }
      }

      // Check for everything else
      if (!this._konvaImages.isFinished || 
          !this._jsonsLoader.isFinished) {
        return;  
      }

      this.start();
    }).bind(this);
    
    // Load every necessary data
    this._konvaImages.load(null, (function() { checkPreloadFinished(); }).bind(this));
    
    // Load the jsons loader
    this._jsonsLoader.callbackSuccess = (function() { checkPreloadFinished(); }).bind(this);
    this._jsonsLoader.load();
    
    // If there are multiple jsons loaders, we load them
    this._jsonsLoaders.forEach(
      (function(jsonsLoader) {
        var originalCallbackSuccess = jsonsLoader.callbackSuccess;

        jsonsLoader.callbackSuccess = (function(json) {
          executeFunctionSafe(originalCallbackSuccess, json);
          checkPreloadFinished();
        }).bind(this);

        jsonsLoader.load();
      }).bind(this)
    );

    // Check if there is no resources to actually load
    checkPreloadFinished();
  }

  start() {
    // Call preload for every layer
    this.layersArray.forEach(
      (function(layer) {
        layer.start();
      }).bind(this)
    );

    this.timeManager = new TimeManager();

    this.eventsManager.initialize(this);

    // Set refresh loop once loaded
    this.refreshIntervalId = setInterval(
      (function(){
        this.refresh();
      }).bind(this), this.refreshTime
    );
    
    this.stage.draw();

    // No loop
    // this.startLoop();
  }

  update(currentTime) {
    this.timeManager.update(currentTime);

    this.layersArray.forEach(
      (function(layer) {
        layer.update(this.timeManager);
      }).bind(this)
    );

    this.animationFrameRequestId = window.requestAnimationFrame(
      (function(currentTime) {
        this.update(currentTime);
      }).bind(this)
    );
  }

  createLayers() {
    this.layers.map = new BMMapLayer(this.stage, this);
    this.layers.game = new BMGameLayers(this.stage, this);
    this.layers.ui = new BMUILayer(this.stage, this, this.player);
    this.layers.uiActions = new BMUIActionsLayer(this.stage, this);
    this.layers.uiHelp = new BMUIHelpLayer(this.stage, this);
    // We create the array for more performance.
    // We consider from now that no layer is going to be created
    // Else we will have to update it 
    this._updateLayersArray();
  }

  _updateLayersArray() {
    this.layersArray = this.getAllLayers();
  }

  initializeLayers() {
    this.layersArray.forEach(
      (function(layer) {
        layer.initialize();
      }).bind(this)
    );
  }

  getGameLayers() {
    return [
      this.layers.map,
      this.layers.game,
    ];
  }

  getAllLayers() {
    var layers = [];
    Object.keys(this.layers).forEach( 
      (function(keyLayer) {
        layers.push(this.layers[keyLayer]);
      }).bind(this)
    );

    return layers;
  }

  refresh() {
    // this.layers.game.refresh();
  }

  addImage(src, ...konvaNodes) { this._konvaImages.add(src, konvaNodes); }
  addJSONLoader(jsonLoader) { this._jsonsLoader.add(jsonLoader); }
  addJSONsLoader(jsonsLoader) { this._jsonsLoaders.push(jsonsLoader); }

  buyCity(city) {
    this.blockchainInterface.buyCity(city, this.player);
  }

  moveToCity(city) {
    this.blockchainInterface.moveToCity(city, this.player); 
  }

  collectCityTreasure(city) {
    this.blockchainInterface.collectTreasure(city, this.player); 
  }

  changeAccount() {
    store.remove(BMPlayer.StoreStringID);
    location.reload();
  }

  startUpdateLoop() {
    this.animationFrameRequestId = window.requestAnimationFrame(
      (function(currentTime) {
        this.update(currentTime);
      }).bind(this)
    );
  }

  stopUpdateLoop() {
    if (this.animationFrameRequestId) {
      window.cancelAnimationFrame(this.animationFrameRequestId);
      this.animationFrameRequestId = null;
    }
  }
}

module.exports = BMGameManager;