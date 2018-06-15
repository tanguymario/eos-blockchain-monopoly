var BMLayer = require('../abstract/bm-layer.js');
var basics = require('../../utils/basics.js');
var BlockchainInterface = require('../backend/blockchain-interface.js');
var executeFunctionSafely = basics.executeFunctionSafely;
var exists = basics.exists;

class BMUIActionsLayer extends BMLayer {
  static actions() { 
    return Object.freeze({
      "Buy": 1,
      "MoveTo": 2,
      "Collect": 3,
      "Cancel": 4
    }); 
  }

  constructor(stage, gameManager, options={}) {
    super(stage, gameManager, options);

    this._callbackAction = null;
    this.hide();
  }

  initialize() {
    this.x(0);
    this.y(0);

    
  }

  preload() {
    
  }

  start() {
    

    

    this.buttonCollect.width(256);
    this.buttonCollect.height(256);
    this.buttonCollect.offsetX(this.buttonCollect.width() / 2);
    this.buttonCollect.offsetY(this.buttonCollect.height() / 2);
    this.buttonCollect.on('click', 
      (function() {
        this.onBtnClick(BMUIActionsLayer.actions().Collect);
      }).bind(this)
    );

    this.buttonCancel.width(128);
    this.buttonCancel.height(128);
    this.buttonCancel.offsetX(this.buttonCancel.width() / 2);
    this.buttonCancel.offsetY(this.buttonCancel.height() / 2);
    this.buttonCancel.on('click', 
      (function() {
        this.onBtnClick(BMUIActionsLayer.actions().Cancel);
      }).bind(this)
    );
  }

  update() {

  }

  onBtnClick(action) {
    this.executeAction(action);
  }

  ask(city, callbackAction) {
    this.labelCity.getText().setText(
      "City: " + city.data.name + "\n" + 
      "Price: " + city.data.price + "\n" +
      "Treasure: " + city.data.treasure);
    this.labelCity.setOffset({x: this.labelCity.getWidth() / 2});

    // Check for buying
    this.buttonBuy.listening(false);
    this.buttonBuy.opacity(0.5);
    this.buttonBuy.opacity(0.5);
    this.buttonDescBuy.opacity(0.5);
    if (this.gameManager.player.currentCity === city && 
        !city.ownedByPlayer) {
      this.buttonBuy.listening(true);
      this.buttonBuy.opacity(1.0);
      this.buttonBuy.opacity(1.0);
      this.buttonDescBuy.opacity(1.0);
    }
  
    // Check for move to 
    this.buttonMoveTo.listening(false);
    this.buttonMoveTo.opacity(0.5);
    this.buttonDescMoveTo.opacity(0.5);
    if (this.gameManager.player.ownedCities.indexOf(city) != -1) {
      // Teleport
      if (city !== this.gameManager.player.currentCity) {
        this.buttonMoveTo.listening(true);
        this.buttonMoveTo.opacity(1.0);
        this.buttonDescMoveTo.opacity(1.0);
      }
    } else if (this.gameManager.player.currentCity) {
      // Move to a neighbour
      var currentCity = this.gameManager.player.currentCity;
      var currentCityNeighbours = currentCity.getNeighbours();
      var nbCurrentCityNeighbours = currentCityNeighbours.length;
      for (var i = 0; i < nbCurrentCityNeighbours; i++) {
        var neighbour = currentCityNeighbours[i];
        if (neighbour === city) {
          this.buttonMoveTo.listening(true);
          this.buttonMoveTo.opacity(1.0);
          this.buttonDescMoveTo.opacity(1.0);
          break;
        }
      }
    } else if (!exists(this.gameManager.player.currentCity)) {
      // The player can move anywhere
      this.buttonMoveTo.listening(true);
      this.buttonMoveTo.opacity(1.0);
      this.buttonDescMoveTo.opacity(1.0);
    }
    
    // Check for treasure in current city
    if (this.gameManager.player.currentCity === city && 
        city.data.treasure > 0) {
      this.buttonCollect.listening(true);
      this.buttonCollect.opacity(1.0);
      this.buttonDescCollect.opacity(1.0);
    } else {
      this.buttonCollect.listening(false);  
      this.buttonCollect.opacity(0.5);
      this.buttonDescCollect.opacity(0.5);
    }
    
    this.enable();
    this.moveToTop();
    this.draw();

    this._callbackAction = callbackAction;
  }

  executeAction(action) {
    executeFunctionSafely(this._callbackAction, action);
    this.hide();
  }

  hide() {
    this._callbackAction = null;
    this.disable();
  }
}

module.exports = BMUIActionsLayer;