var BMLayer = require('../abstract/bm-layer.js');
var basics = require('../../utils/basics.js');
var BlockchainInterface = require('../backend/blockchain-interface.js');
var executeFunctionSafely = basics.executeFunctionSafely;

class BMUIActionsLayer extends BMLayer {
  static actions() { 
    return Object.freeze({
      "Buy": 1,
      "Move": 2,
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

    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height(),
      fill: "black",
      opacity: 0.85,
      listening: true,
      draggable: false
    });
    this.add(this.background);

    this.labelCity = new Konva.Label({
      x: this.stage.width() / 2,
      y: 50
    });
    this.labelCity.add(
      new Konva.Text({
        text: "",
        fill: "white",
        align: "center",
        fontSize: 56
      })
    );
    this.add(this.labelCity);

    this.buttonBuy = new Konva.Image({
      x: this.stage.width() / 4,
      y: this.stage.height() / 2 - 50
    });
    this.add(this.buttonBuy);
    this.buttonDescBuy = new Konva.Text({
      x: this.buttonBuy.x(),
      y: this.buttonBuy.y() + 50 + 256 / 2,
      text: 'Buy',
      fontSize: 56,
      fill: "white",
      align: "center"
    });
    this.buttonDescBuy.setOffset({ x: this.buttonDescBuy.getWidth() / 2 });
    this.add(this.buttonDescBuy);

    this.buttonMoveTo = new Konva.Image({
      x: (this.stage.width() / 4) * 2,
      y: this.stage.height() / 2 - 50
    });
    this.add(this.buttonMoveTo);
    this.buttonDescMoveTo = new Konva.Text({
      x: this.buttonMoveTo.x(),
      y: this.buttonMoveTo.y() + 50 + 256 / 2,
      text: 'Move To',
      fontSize: 56,
      fill: "white",
      align: "center"
    });
    this.buttonDescMoveTo.setOffset({ x: this.buttonDescMoveTo.getWidth() / 2 });
    this.add(this.buttonDescMoveTo);

    this.buttonCollect = new Konva.Image({
      x: (this.stage.width() / 4) * 3,
      y: this.stage.height() / 2 - 50
    });
    this.add(this.buttonCollect);    
    this.buttonDescCollect = new Konva.Text({
      x: this.buttonCollect.x(),
      y: this.buttonCollect.y() + 50 + 256 / 2,
      text: 'Collect Treasure',
      fontSize: 56,
      fill: "white",
      align: "center"
    });
    this.buttonDescCollect.setOffset({ x: this.buttonDescCollect.getWidth() / 2 });
    this.add(this.buttonDescCollect);

    this.buttonCancel = new Konva.Image({
      x: this.stage.width() / 2,
      y: this.stage.height() * 0.9
    });
    this.add(this.buttonCancel);
  }

  preload() {
    this.gameManager.addImage('assets/imgs/actionBuy.png', this.buttonBuy);
    this.gameManager.addImage('assets/imgs/actionMoveTo.png', this.buttonMoveTo);
    this.gameManager.addImage('assets/imgs/actionCollect.png', this.buttonCollect);
    this.gameManager.addImage('assets/imgs/actionCancel.png', this.buttonCancel);
  }

  start() {
    this.buttonBuy.width(256);
    this.buttonBuy.height(256);
    this.buttonBuy.offsetX(this.buttonBuy.width() / 2);
    this.buttonBuy.offsetY(this.buttonBuy.height() / 2);
    this.buttonBuy.on('click', 
      (function() {
        this.onBtnClick(BMUIActionsLayer.actions().Buy);
      }).bind(this)
    );

    this.buttonMoveTo.width(256);
    this.buttonMoveTo.height(256);
    this.buttonMoveTo.offsetX(this.buttonMoveTo.width() / 2);
    this.buttonMoveTo.offsetY(this.buttonMoveTo.height() / 2);
    this.buttonMoveTo.on('click', 
      (function() {
        this.onBtnClick(BMUIActionsLayer.actions().MoveTo);
      }).bind(this)
    );

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
      city.data.name + "\n" + 
      city.data.price);
    this.labelCity.setOffset({x: this.labelCity.getWidth() / 2});

    // Check for buying
    this.buttonBuy.listening(false);
    this.buttonBuy.opacity(0.5);
    this.buttonBuy.opacity(0.5);
    this.buttonDescBuy.opacity(0.5);
    if (this.gameManager.player.currentCity === city &&
        city.player !== this.gameManager.player) {
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
      if (city !== this.gameManager.player.currentCity) {
        this.buttonMoveTo.listening(true);
        this.buttonMoveTo.opacity(1.0);
        this.buttonDescMoveTo.opacity(1.0);
      }
    } else if (this.gameManager.player.currentCity) {
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
    }
    
    // Check for treasure in current city
    if (this.gameManager.player.currentCity === city && 
      ("" + city.data.treasure !== "0")) {
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