var BMMultipleLayers = require('../abstract/bm-multiple-layers.js');
var BMGameLayer = require('./bm-game-layer.js');
var BMLayer = require('../abstract/bm-layer.js');
var BMGameCommonLayer = require('./bm-game-common-layer.js');
var BMCity = require('../data-classes/bm-city.js');
var BMCitiesConnection = require('../data-classes/bm-cities-connection.js');

var JSONLoader = require('../../utils/json-loader.js');
var JSONsLoader = require('../../utils/jsons-loader.js');
var basics = require('../../utils/basics.js');
var exists = basics.exists;

var memory = require('../../utils/memory.js');

class BMGameLayers extends BMMultipleLayers {
  constructor(stage, gameManager, options={}) {
    super(stage, gameManager, options);
    
    this.cities = {};
    this.connections = [];

    this.isRefreshing = false;
  }

  initialize() {
    this.commonLayer = new BMGameCommonLayer(this.stage, this.gameManager);
    this.addLayer(this.commonLayer); 
  }

  preload() {
    this.isRefreshing = true;

    // Online version
    this.collectData();
    // End online version

    // Local version
    /*
    this.blockchainCitiesDataJSONLoader = new JSONLoader('assets/json/blockchainLocalTest.json', { keepData: true });
    this.gameManager.addJSONLoader(this.blockchainCitiesDataJSONLoader);

    this.blockchainPlayerDataJSONLoader = new JSONLoader('assets/json/blockchainPlayer.json', { keepData: true });
    this.gameManager.addJSONLoader(this.blockchainPlayerDataJSONLoader);

    this.mapCitiesDataJSONLoader = new JSONLoader('assets/json/mapCitiesData.json', { keepData: true });
    this.gameManager.addJSONLoader(this.mapCitiesDataJSONLoader);
    */
    // End local version
  }

  start() {
    // this.onRefreshData();
  }

  update() {

  }

  collectData() {
    this.gameManager.blockchainInterface.getCities().then(blockchainInterfaceCitiesOutput => {
      var blockchainCitiesJSON;
      try {
        blockchainCitiesJSON = JSON.parse(blockchainInterfaceCitiesOutput.result);
      } catch(e) {
        console.error(e);
        return;
      }

      this.gameManager.blockchainInterface.getPlayerPosition(this.gameManager.player.address).then(blockchainPlayerJSON => {
        new JSONLoader('assets/json/mapCitiesData.json', {
          callbackSuccess: (function(mapCitiesJSON) {

                // console.log("thats me");
                // console.log(blockchainCitiesJSON);
                // console.log(blockchainPlayerJSON);

                this.onRefreshData(blockchainCitiesJSON, mapCitiesJSON, blockchainPlayerJSON);
          }).bind(this)
        }
      ).load();
      });
    });
  }

  getGameLayers() {
    var gameLayers = [];
    this.layers.forEach(
      (function(layer) {
        if (layer instanceof BMGameLayer) {
          gameLayers.push(layer);
        }
      }).bind(this)
    );
    return gameLayers;
  }

  refresh() {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    
    // Online version
    this.collectData();
    // End online version

    // Local version
    /*
    var jsonsLoader = new JSONsLoader();
    jsonsLoader.callbackSuccess = (function() {
      this.onRefreshData();
      this.draw();
    }).bind(this);

    this.blockchainCitiesDataJSONLoader = new JSONLoader('assets/json/blockchainLocalTest.json', { keepData: true });
    jsonsLoader.add(this.blockchainCitiesDataJSONLoader);
    
    this.blockchainPlayerDataJSONLoader = new JSONLoader('assets/json/blockchainPlayer.json', { keepData: true });
    jsonsLoader.add(this.blockchainPlayerDataJSONLoader);

    this.mapCitiesDataJSONLoader = new JSONLoader('assets/json/mapCitiesData.json', { keepData: true });
    jsonsLoader.add(this.mapCitiesDataJSONLoader);
    jsonsLoader.load();
    */
    // End local version
  }

  onRefreshData(blockchainCitiesJSON, mapCitiesJSON, playerJSON) {
    // Local version
    /*
    blockchainCitiesJSON = this.blockchainCitiesDataJSONLoader.getData();
    this.blockchainCitiesDataJSONLoader.clean();
    delete this.blockchainCitiesDataJSONLoader;
    mapCitiesJSON = this.mapCitiesDataJSONLoader.getData();
    this.mapCitiesDataJSONLoader.clean();
    delete this.mapCitiesDataJSONLoader;
    playerJSON = this.blockchainPlayerDataJSONLoader.getData();
    this.blockchainPlayerDataJSONLoader.clean();
    delete this.blockchainPlayerDataJSONLoader;
    */
    // End local version
    
    if (!exists(blockchainCitiesJSON)) {
      console.error("[BMGameLayers] Could not retrieve blockchain cities");
      return;
    } else if (!exists(mapCitiesJSON)) {
      console.error("[BMGameLayers] Could not retrieve blockchain player");
      return;
    } else if (!exists(playerJSON)) {
      console.error("[BMGameLayers] Could not retrieve map cities");
      return;
    }

    // Concat blockchain with map data
    blockchainCitiesJSON = this.setupBlockchainData(
      blockchainCitiesJSON, 
      mapCitiesJSON
    );

    // Start DEBUG MEMORY
    // Clear game layers and data associated
    for (var i = 0; i < this.layers.length; i++) {
      var layer = this.layers[i];
      // Check out the number of nodes (are they the same between refreshes)?
      if (layer instanceof BMGameLayer) {
        layer.listening(false);
        layer.remove();
        layer.destroy();
        layer.destroyChildren();
        layer.destroyJSObject();
        this.layers.splice(i, 1);
        i--;
      }
    }

    // Remove events, clear cities 
    var citiesKeys = Object.keys(this.cities);
    citiesKeys.forEach(
      (function(cityKey) {
        var city = this.cities[cityKey];
        city.removeEvents();
        city.destroyJSObject();
      }).bind(this)
    );

    this.connections.forEach(
      (function(connection) {
        connection.destroyJSObject();
      }).bind(this)
    );

    this.cities = {};
    this.connections = [];

    this.stage.clearCache();
    // End DEBUG MEMORY
    
    // Create cities and connections
    this.initializeCities(blockchainCitiesJSON);

    // Initialize player with blockchain data
    this.gameManager.player.initialize(this.cities, playerJSON);

    // Reposition and rescale the layers 
    this.scale({
      x: this.gameManager.eventsManager.scale,
      y: this.gameManager.eventsManager.scale
    });
    this.position(this.gameManager.eventsManager.pos);

    // Always move the common layer to the top
    this.commonLayer.moveToTop();

    // Move ui layers to the top
    this.gameManager.layers.ui.moveToTop();
    this.gameManager.layers.uiHelp.moveToTop();
    
    this.gameManager.layers.ui.initPlayerInformation();
  
    var previousSelectedCityId = this.gameManager.layers.ui._cityId;
    var previousSelectedCity = this.cities[previousSelectedCityId];
    if (!exists(previousSelectedCity)) {
      this.gameManager.layers.ui.setupActions(previousSelectedCity);
    } else {
      previousSelectedCity.setupCityActions();
    }
    
    this.isRefreshing = false;

    // Online version
    this.stage.draw();
    // End online version
  }

  setupBlockchainData(blockchainCitiesJSON, mapCitiesJSON) {
    var blockchainCitiesJSONKeys = Object.keys(blockchainCitiesJSON);
    var nbBlockchainCitiesJSONKeys = blockchainCitiesJSONKeys.length;
    for (var i = 0; i < nbBlockchainCitiesJSONKeys; i++) {
      var blockchainCityJSONKey = blockchainCitiesJSONKeys[i];
      var blockchainCityJSON = blockchainCitiesJSON[blockchainCityJSONKey];
      if (!(blockchainCityJSONKey in mapCitiesJSON)) {
        console.warn(
          "[BMGameLayers] Could not get the corresponding mapCity to the blockchainCity!\n \
           Deleting blockchainCity...");
        console.warn(blockchainCityJSON);
        delete blockchainCitiesJSON[blockchainCityJSONKey];
        continue;
      }

      var mapCityJSON = mapCitiesJSON[blockchainCityJSONKey];
      Object.keys(mapCityJSON).forEach(
        (function(mapCityJSONKey) {
          blockchainCityJSON[mapCityJSONKey] = mapCityJSON[mapCityJSONKey];
        }).bind(this)
      );
    }

    return blockchainCitiesJSON;
  }

  initializeCities(citiesJSON) {
    this.createLayers(citiesJSON);
    this.createCities(citiesJSON);

    this.createConnectionsBetweenCities();
  }

  scale(scale) {
    var inverseScale = {
      x: 1.0 / scale.x,
      y: 1.0 / scale.y
    }

    // Scale layers
    this.layers.forEach(
      (function(layer) {
        layer.scale(scale);
      }).bind(this)
    );

    // Scale cities
    var citiesKeys = Object.keys(this.cities);
    citiesKeys.forEach(
      (function(cityKey) {
        var city = this.cities[cityKey];
        city.view.scale(inverseScale);
      }).bind(this)
    );

    // Scale connections
    this.connections.forEach(
      (function(connection) {
        connection.scale(scale);
      }).bind(this)
    );
  }

  createLayers(citiesJSON) {
    var citiesJSONKeys = Object.keys(citiesJSON);
    var nbGameLayers = (function() {
      var maxLayerIndex = 0;
      citiesJSONKeys.forEach(
        (function(cityJSONKey) {
          var cityJSON = citiesJSON[cityJSONKey];
          maxLayerIndex = Math.max(maxLayerIndex, cityJSON.layerIndex);  
        }).bind(this) 
      );
      return maxLayerIndex + 1;
    })();

    for (var i = nbGameLayers - 1; i >= 0; i--) {
      var layer = new BMGameLayer(this.stage, this.gameManager, i);
      this.layers.splice(0, 0, layer);
    }
  }

  createCities(citiesJSON) {
    Object.keys(citiesJSON).forEach( 
      (function(cityJSONKey) {
        var cityJSON = citiesJSON[cityJSONKey];
        var layer = this.getLayerAt(cityJSON.layerIndex);
        var city = new BMCity(cityJSONKey, cityJSON, layer, this);
        this.cities[cityJSONKey] = city;
      }).bind(this)
    );
  }

  createConnectionsBetweenCities() {
    var citiesKeys = Object.keys(this.cities);
    citiesKeys.forEach(
      (function(cityKey) {
        var city = this.cities[cityKey];
        var nbNeighbours = city.data.neighbors.length;
        for (var j = 0; j < nbNeighbours; j++) {
          var idNeighbor = city.data.neighbors[j];
          var neighborCity = this.cities[idNeighbor];
          if (!neighborCity) {
            continue;
          }

          var alreadyConnected = false;
          var nbNeighborCityConnections = neighborCity.connections.length;
          for (var k = 0; k < nbNeighborCityConnections; k++) {
            var connection = neighborCity.connections[k];
            if (connection.city0 === city ||
                connection.city1 === city) {
              alreadyConnected = true;
              break;
            }
          }

          if (alreadyConnected) {
            continue;
          }

          var connection = new BMCitiesConnection(city, neighborCity);
          this.connections.push(connection);
        }
      }).bind(this)
    );

    /*
    var nbCities = this.cities.length;
    for (var i = 0; i < nbCities; i++) {
      var city = this.cities[i];
      var nbNeighbours = city.data.neighbors.length;
      for (var j = 0; j < nbNeighbours; j++) {
        var idNeighbor = city.data.neighbors[j];

        // TODO change this
        idNeighbor = parseInt(idNeighbor);

        if (idNeighbor > i) {
          continue;
        }

        var cityNeighbor = this.cities[idNeighbor];
        var connection = new BMCitiesConnection(city, cityNeighbor);
        this.connections.push(connection);
      }
    }
    */
  }
}

module.exports = BMGameLayers;