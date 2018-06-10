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
  }

  preload() {
    this.gameManager.addImage('assets/imgs/helpButton.png', this.btnHelp);
  }

  start() {
    this.upperLeftLabel.getText().setText(
      'Account username: ' + this.player.address + '\n' +
      'Public key: ' + this.player.data.publicKey + '\n' + 
      'Number of owned cities: ' + this.player.ownedCities.length + '\n' +
      'Location: ' + (this.player.currentCity ? this.player.currentCity.data.name : "-")
    );

    this.btnChangeAccount.x(this.upperLeftLabel.x() + this.upperLeftLabel.getWidth() + 10);
    this.btnChangeAccount.y(this.upperLeftLabel.y());

    // We need to put ui layer at the top of the application
    // Beacause game layers will be added asynchronously during preload()
    this.moveToTop();
  }
}

module.exports = BMUILayer;