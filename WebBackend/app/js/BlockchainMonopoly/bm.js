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

    this.eventsManager = new BMEventsManager(this.stage);
    this.gameManager = new BMGameManager(this.stage, this.eventsManager);
  }
}

module.exports = BM;