var BMCityStyle = require('./bm-city-style.js');
var BMCityView = require('./bm-city-view.js');
var BMUIActionsLayer = require('../layers/bm-ui-actions-layer.js');
var constants = require('../../utils/constants.js');

class BMCity {
  constructor(cityJSONId, cityJSON, layer, gameLayer) {
    this.id = cityJSONId;
    this.data = cityJSON;

    this.layer = layer;
    this.gameLayer = gameLayer;
    this.stage = this.gameLayer.stage;
    this.gameManager = this.gameLayer.gameManager;

    this.ownedByPlayer = false;
    this.currentCityPlayer = false;
    this.isNearFromPlayer = false;

    this.connections = [];

    this.view = new BMCityView(this.stage, this, this.layer);
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

  setOwnedCity() {
    this.ownedByPlayer = true;
    if (!this.currentCityPlayer) {
      this.view.setStyle(BMCityStyle.styleOwned());
    }
  }

  setCurrentCity(player) {
    this.currentCityPlayer = true;
    this.player = player;
    this.view.setStyle(BMCityStyle.styleCurrent());

    this.connections.forEach(
      (function(connection) {
        connection.city0.setNearCity();
        connection.city1.setNearCity();
      }).bind(this)
    );
  }

  setNearCity() {
    if (!this.currentCityPlayer) {
      this.isNearFromPlayer = true;
      this.view.setStyle(BMCityStyle.styleNear());
    }
  }

  onCallbackAction(action) {
    switch (action) {
      case BMUIActionsLayer.actions().Buy:
        this.gameManager.buyCity(this);
        break;
      case BMUIActionsLayer.actions().MoveTo:
        this.gameManager.moveToCity(this); 
        break;
      case BMUIActionsLayer.actions().Collect:
        this.gameManager.collectCityTreasure(this);
        break;
      case BMUIActionsLayer.actions().Cancel:
        break;
      default:
        console.warn("[BMCity] Unknown action", action);
        break;
    }
  }

  onMouseEnter(evt) {
    this.gameLayer.commonLayer.showTooltip(this);
  }

  onMouseOut(evt) {
    this.gameLayer.commonLayer.hideTooltip(this);
  }

  onClick(evt) {
    switch (evt.evt.button) {
      case constants.BTN_LEFT_CLICK:
        this.gameManager.layers.uiActions.ask(
          this,
          (function(action) {
            this.onCallbackAction(action);
          }).bind(this)
        );
        break;
      case constants.BTN_MIDDLE_CLICK:
        break;
      case constants.BTN_RIGHT_CLICK:
        break;
      default:
        break;
    }
  }
}

module.exports = BMCity;