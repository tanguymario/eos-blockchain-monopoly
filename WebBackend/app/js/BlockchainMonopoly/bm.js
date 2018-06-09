var Konva = require('konva');
var BMGameManager = require('./managers/bm-game-manager.js');
var BMEventsManager = require('./managers/bm-events-manager.js');

class BM {
  constructor() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.stage = new Konva.Stage({
      container: 'viewer',
      width: width,
      height: height
    });

    this.gameManager = new BMGameManager(this.stage);
    this.eventsManager = new BMEventsManager(this.stage, this.gameManager);
  }
}

module.exports = BM;