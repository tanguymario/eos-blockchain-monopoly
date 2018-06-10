var Konva = require('konva');
var BMLayer = require('../abstract/bm-layer.js');
var konvaUtils = require('../../utils/konva-utils.js');

class BMUIHelpLayer extends BMLayer {
  constructor(stage, gameManager, options={}) {
    super(stage, gameManager, options);
  }

  initialize() {
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: 'black',
      opacity: 0.7
    });
    this.add(this.background);

    this.btnCancel = new Konva.Image({
      x: this.stage.width() / 2,
      y: this.stage.height() * 0.9
    });
    this.add(this.btnCancel);

    this.helpLegend = new Konva.Image({
      x: 50,
      y: 50,
      width: this.stage.width() * 0.35,
      height: this.stage.height() * 0.8 - 50
    });
    this.add(this.helpLegend);

    this.helpDescription = new Konva.Label({
      x: this.helpLegend.x() + this.helpLegend.getWidth() + 50,
      y: 50,
      opacity: 1.0,
      visible: true,
      listening: false
    });
    this.helpDescription.add(
      new Konva.Text({
        text: 
          "Help:\n" + 
          "To interact with a city click on it\n" +
          "A menu will appear with three options:\n" +
          "\n" + 
          " - Buy: \n" + 
          "   You can buy a city if you are located in that city.\n" +
          "\n" + 
          " - Move To: \n" + 
          "   You can travel in the map \n" + 
          "   by moving to near cities around your loaction\n" + 
          "   or teleporting (see later)\n" +
          "\n" + 
          " - Collect Treasure: \n" +
          "   If there is a treasure in your location/city,\n" + 
          "   you can collect it\n" +
          "\n" + 
          "\n" +
          "When you own a city, you can move to it anytime (teleporting)\n" +
          "\n" +
          "The first time you play, you can go to any city in the map\n" + 
          ""
          ,
        fontFamily: 'Calibri',
        fontSize: 20,
        padding: 10,
        fill: 'white',
        listening: false
      })
    );
    this.add(this.helpDescription);
  }

  preload() {
    this.gameManager.addImage('assets/imgs/actionCancel.png', this.btnCancel);
    this.gameManager.addImage('assets/imgs/helpLegend.png', this.helpLegend);
  }

  start() {
    this.btnCancel.width(128);
    this.btnCancel.height(128);
    this.btnCancel.offsetX(this.btnCancel.width() / 2);
    this.btnCancel.offsetY(this.btnCancel.height() / 2);
    this.btnCancel.on('click', 
      (function() {
        this.hide();
      }).bind(this)
    );

    this.hide();
  }

  update() {

  }

  show() {
    konvaUtils.enableNode(this);
    this.moveToTop();
    this.draw();
  } 

  hide() {
    konvaUtils.disableNode(this);
    this.draw();
  }
}

module.exports = BMUIHelpLayer;