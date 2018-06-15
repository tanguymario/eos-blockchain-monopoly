var BMLayer = require('../abstract/bm-layer.js');
var BMPlayer = require('../data-classes/bm-player.js');

class BMUILayer extends BMLayer {
  constructor(stage, gameManager, player, options={}) {
    if (!(player instanceof BMPlayer)) {
      throw "[BMUILayer] User missing";
    }

    options.listening = false;
    super(stage, gameManager, options);

    this.player = player;
  }

  initialize() {
    this.upperLeftLabel = new Konva.Label({
      x: 10,
      y: 10,
      opacity: 0.95,
      visible: true,
      listening: false
    });
    this.upperLeftLabel.add(
      new Konva.Tag({
        fill: 'black',
        lineJoin: 'round',
        shadowColor: 'black',
        cornerRadius: 10,
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5,
        listening: false
      })
    );
    this.upperLeftLabel.add(
      new Konva.Text({
        text: '',
        fontFamily: 'Calibri',
        fontSize: 20,
        padding: 10,
        fill: 'white',
        listening: false
      })
    );
    this.add(this.upperLeftLabel);

    this.btnChangeAccount = new Konva.Label({
      x: 0,
      y: 0,
      opacity: 0.95,
      visible: true,
      listening: true
    });
    this.btnChangeAccount.add(
      new Konva.Tag({
        fill: 'white',
        lineJoin: 'round',
        shadowColor: 'black',
        cornerRadius: 10,
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5,
        listening: true
      })
    );
    this.btnChangeAccount.add(
      new Konva.Text({
        text: 
          '\n' +
          'Change' + '\n' +
          'Account' +
          '\n'
          ,
        fontFamily: 'Calibri',
        fontSize: 20,
        padding: 10,
        fill: 'black',
        listening: false
      })
    );
    this.btnChangeAccount.on('click', 
      (function(){
        this.gameManager.changeAccount();
      }).bind(this)
    );
    this.add(this.btnChangeAccount);

    this.btnHelp = new Konva.Image({
      x: 20,
      y: this.stage.height() - 20 - 128,
      width: 128,
      height: 128,
      listening: true,
      visible: true,
      draggable: false
    });
    this.btnHelp.on('click',
      (function() {
        this.gameManager.layers.uiHelp.show();
      }).bind(this)
    );
    this.add(this.btnHelp);

    this.actionsGroup = new Konva.Group({
      x: this.stage.width() * 0.75,
      y: 0,
      width: this.stage.width() * 0.25,
      height: this.stage.height(),
      visible: true,
      listening: true,
      draggable: false
    });
    this.add(this.actionsGroup);

    this.actionsbackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.actionsGroup.width(),
      height: this.actionsGroup.height(),
      fill: "black",
      opacity: 0.85,
      listening: true,
      draggable: false
    });
    this.actionsGroup.add(this.actionsbackground);

    this.labelCity = new Konva.Label({
      x: this.actionsGroup.width() / 2,
      y: 50
    });
    this.labelCity.add(
      new Konva.Text({
        text: "",
        fill: "white",
        align: "center",
        fontSize: 42
      })
    );
    this.actionsGroup.add(this.labelCity);

    this.buttonBuy = new Konva.Image({
      x: this.actionsGroup.width() / 2,
      y: (this.actionsGroup.height() / 4) * 1,
    });
    this.buttonBuy.width(128);
    this.buttonBuy.height(128);
    this.buttonBuy.offsetX(this.buttonBuy.width() / 2);
    this.buttonBuy.offsetY(this.buttonBuy.height() / 2);
    this.buttonBuy.on('click', 
      (function() {
        // TODO
        // this.onBtnClick(BMUIActionsLayer.actions().Buy);
      }).bind(this)
    );
    this.actionsGroup.add(this.buttonBuy);
    this.buttonDescBuy = new Konva.Text({
      x: this.buttonBuy.x(),
      y: this.buttonBuy.y() + 50 + this.buttonBuy.height() / 2,
      text: 'Buy',
      fontSize: 42,
      fill: "white",
      align: "center"
    });
    this.buttonDescBuy.setOffset({ x: this.buttonDescBuy.getWidth() / 2 });
    this.actionsGroup.add(this.buttonDescBuy);

    this.buttonMoveTo = new Konva.Image({
      x: this.actionsGroup.width() / 2,
      y: (this.actionsGroup.height() / 4) * 2
    });
    this.buttonMoveTo.width(128);
    this.buttonMoveTo.height(128);
    this.buttonMoveTo.offsetX(this.buttonMoveTo.width() / 2);
    this.buttonMoveTo.offsetY(this.buttonMoveTo.height() / 2);
    this.buttonMoveTo.on('click', 
      (function() {
        this.onBtnClick(BMUIActionsLayer.actions().MoveTo);
      }).bind(this)
    );
    this.actionsGroup.add(this.buttonMoveTo);
    this.buttonDescMoveTo = new Konva.Text({
      x: this.buttonMoveTo.x(),
      y: this.buttonMoveTo.y() + 50 + this.buttonMoveTo.height() / 2,
      text: 'Move To',
      fontSize: 42,
      fill: "white",
      align: "center"
    });
    this.buttonDescMoveTo.setOffset({ x: this.buttonDescMoveTo.getWidth() / 2 });
    this.actionsGroup.add(this.buttonDescMoveTo);

    this.buttonCollect = new Konva.Image({
      x: this.actionsGroup.width() / 2,
      y: (this.actionsGroup.height() / 4) * 3
    });
    this.actionsGroup.add(this.buttonCollect);    
    this.buttonDescCollect = new Konva.Text({
      x: this.buttonCollect.x(),
      y: this.buttonCollect.y() + 50 + 256 / 2,
      text: 'Collect Treasure',
      fontSize: 42,
      fill: "white",
      align: "center"
    });
    this.buttonDescCollect.setOffset({ x: this.buttonDescCollect.getWidth() / 2 });
    this.actionsGroup.add(this.buttonDescCollect);
  }

  preload() {
    this.gameManager.addImage('assets/imgs/helpButton.png', this.btnHelp);
    this.gameManager.addImage('assets/imgs/actionBuy.png', this.buttonBuy);
    this.gameManager.addImage('assets/imgs/actionMoveTo.png', this.buttonMoveTo);
    this.gameManager.addImage('assets/imgs/actionCollect.png', this.buttonCollect);
  }

  start() {
    // We need to put ui layer at the top of the application
    // Beacause game layers will be added asynchronously during preload()
    this.moveToTop();
  }

  initPlayerInformation() {
    this.upperLeftLabel.getText().setText(
      'Account username: ' + this.player.address + '\n' +
      'Public key: ' + this.player.data.publicKey + '\n' + 
      'Number of owned cities: ' + this.player.ownedCities.length + '\n' +
      'Location: ' + (this.player.currentCity ? this.player.currentCity.data.name : "-")
    );

    this.btnChangeAccount.x(this.upperLeftLabel.x() + this.upperLeftLabel.getWidth() + 10);
    this.btnChangeAccount.y(this.upperLeftLabel.y());
  }
}

module.exports = BMUILayer;