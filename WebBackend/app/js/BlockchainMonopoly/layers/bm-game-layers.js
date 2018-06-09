var BMMultipleLayers = require('../abstract/bm-multiple-layers.js');
var BMGameLayer = require('./bm-game-layer.js');
var BMLayer = require('../abstract/bm-layer.js');
var BMGameCommonLayer = require('./bm-game-common-layer.js');
var BMCity = require('../data-classes/bm-city.js');
var BMCitiesConnection = require('../data-classes/bm-cities-connection.js');

var JSONLoader = require('../../utils/json-loader.js');
var basics = require('../../utils/basics.js');
var exists = basics.exists;

class BMGameLayers extends BMMultipleLayers {
  constructor(stage, gameManager, options={}) {
    super(stage, gameManager, options);
    
    this.cities = [];
    this.connections = [];
  }

  initialize() {

  }

  preload() {
    this.blockchainCitiesDataJSONLoader = new JSONLoader('assets/json/blockchainLocalTest.json', { keepData: true });
    this.gameManager.addJSONLoader(this.blockchainCitiesDataJSONLoader);

    this.blockchainPlayerDataJSONLoader = new JSONLoader('assets/json/blockchainPlayer.json', { keepData: true });
    this.gameManager.addJSONLoader(this.blockchainPlayerDataJSONLoader);

    this.mapCitiesDataJSONLoader = new JSONLoader('assets/json/mapCitiesData.json', { keepData: true });
    this.gameManager.addJSONLoader(this.mapCitiesDataJSONLoader);
  }

  start() {
    if (!exists(this.blockchainCitiesDataJSONLoader.getData())) {
      console.error("[BMGameLayers] Could not retrieve blockchain cities");
      return;
    } else if (!exists(this.blockchainPlayerDataJSONLoader.getData())) {
      console.error("[BMGameLayers] Could not retrieve blockchain player");
      return;
    } else if (!exists(this.mapCitiesDataJSONLoader.getData())) {
      console.error("[BMGameLayers] Could not retrieve map cities");
      return;
    }

    // Concat blockchain with map data
    var blockchainCitiesJSON = this.setupBlockchainData(
      this.blockchainCitiesDataJSONLoader.getData(), 
      this.mapCitiesDataJSONLoader.getData()
    );

    // Create cities and connections
    this.initializeCities(blockchainCitiesJSON);

    // Initialize player with blockchain data
    this.gameManager.player.initialize(this.cities, this.blockchainPlayerDataJSONLoader.getData());

    // Finally clear the loaders
    delete this.mapCitiesDataJSONLoader;
    delete this.blockchainPlayerDataJSONLoader;
    delete this.mapCitiesDataJSONLoader;
  }

  update() {

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

    // We scale to automatically enable / disable layers 
    this.scale({x: 1.0, y: 1.0}); 
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
    this.cities.forEach(
      (function(city) {
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
      this.addLayer(layer);
    }

    this.commonLayer = new BMGameCommonLayer(this.stage, this.gameManager, nbGameLayers);
    this.addLayer(this.commonLayer);
  }

  createCities(citiesJSON) {
    Object.keys(citiesJSON).forEach( 
      (function(cityJSONKey) {
        var cityJSON = citiesJSON[cityJSONKey];
        var layer = this.getLayerAt(cityJSON.layerIndex);
        var city = new BMCity(cityJSONKey, cityJSON, layer, this);
        this.cities.push(city);
      }).bind(this)
    );
  }

  createConnectionsBetweenCities() {
    // TODO we suppose that the JSON is sorted!!

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
  }
}

module.exports = BMGameLayers;