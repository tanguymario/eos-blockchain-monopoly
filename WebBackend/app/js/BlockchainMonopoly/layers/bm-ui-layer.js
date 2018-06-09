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
    this.usernameBar = new Konva.Image({
      x: 0,
      y: 0,
      width: 512,
      height: 128,
      offset : {
        x: 0,
        y: 0
      },
      listening: false,
      draggable: false
    });
    this.add(this.usernameBar);    
    
    this.username = new Konva.Text({
      x: 110,
      y: 40,
      text: this.player.address,
      fontSize: 50,
      fontFamily: 'Calibri',
      fill: 'black',
      listening: false,
      draggable: false
    });
    this.add(this.username);
  }

  preload(options={}) {
    this.gameManager.addImage('assets/imgs/uiUsernameBar.png', this.usernameBar);
  }

  start() {
    // We need to put ui layer at the top of the application
    // Beacause game layers will be added asynchronously during preload()
    this.moveToTop();
  }
}

module.exports = BMUILayer;