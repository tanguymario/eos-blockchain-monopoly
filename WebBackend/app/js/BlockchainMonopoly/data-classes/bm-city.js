var BMCityStyle = require('./bm-city-style.js');
var BMCityView = require('./bm-city-view.js');
var BMUILayer = require('../layers/bm-ui-layer.js');
var constants = require('../../utils/constants.js');

class BMCity {
  constructor(cityJSONId, cityJSON, layer, gameLayers) {
    this.id = cityJSONId;
    this.data = cityJSON;

    this.layer = layer;
    this.gameLayers = gameLayers;
    
    this.ownedByPlayer = false;
    this.currentCityPlayer = false;
    this.isNearFromPlayer = false;

    this.connections = [];
  }

  getNeighbours() {
    var neighbours = [];
    this.connections.forEach(
      (function(connection) {
        var neighbour = connection.city0 === this ? connection.city1 : connection.city0;
        neighbours.push(neighbour);
      }).bind(this)
    );
    return neighbours;
  }

  setCurrentCity(player) {
    this.currentCityPlayer = true;
    this.player = player;
    this.view.setCurrentCity();

    this.connections.forEach(
      (function(connection) {
        connection.city0.setNearCity();
        connection.city1.setNearCity();
      }).bind(this)
    );

    // We set the default city here
    this.setupCityActions();
  }

  setNearCity() {
    if (!this.currentCityPlayer) {
      this.isNearFromPlayer = true;
      this.view.setNearCity();
    }
  }

  onCallbackAction(action) {
    switch (action) {
      case BMUILayer.Actions().Buy:
        this.layer.gameManager.buyCity(this);
        break;
      case BMUILayer.Actions().MoveTo:
        this.layer.gameManager.moveToCity(this); 
        break;
      case BMUILayer.Actions().Collect:
        this.layer.gameManager.collectCityTreasure(this);
        break;
      default:
        console.warn("[BMCity] Unknown action", action);
        break;
    }
  }

  removeEvents() {
    this.view.removeEvents();
  }

  onMouseEnter(evt) {
    this.gameLayers.commonLayer.showTooltip(this);
  }

  onMouseOut(evt) {
    this.gameLayers.commonLayer.hideTooltip(this);
  }

  onClick(evt) {
    switch (evt.evt.button) {
      case constants.BTN_LEFT_CLICK:
        this.setupCityActions();
        break;
      case constants.BTN_MIDDLE_CLICK:
        break;
      case constants.BTN_RIGHT_CLICK:
        break;
      default:
        break;
    }
  }

  setupCityActions() {
    this.layer.gameManager.layers.ui.setupActions(
      this,
      (function(action) {
        this.onCallbackAction(action);
      }).bind(this)
    );
  }
}

module.exports = BMCity;