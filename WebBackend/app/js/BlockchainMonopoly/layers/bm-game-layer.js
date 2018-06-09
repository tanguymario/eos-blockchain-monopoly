var BMLayer = require('../abstract/bm-layer.js');

class BMGameLayer extends BMLayer {
  static INIT_ZOOM_FACTOR() { return 2.5; }

  constructor(stage, gameManager, layerIndex, options={}) {
    super(stage, gameManager, options);

    this.layerIndex = layerIndex;
    this.zoom = 0.0 + this.layerIndex * BMGameLayer.INIT_ZOOM_FACTOR();

    // Idea to draw lots of cities (useful only when lots of cities)
    // Create a tree with either:
    //  - leafs or cities
    //  - groups of cities
    // Create bounds and then check if bounds check screen
    // If yes then draw
  }

  scale(scale) {
    super.scale(scale);

    if (this.zoom < this.scaleX()) {
      this.enable();
    } else {
      this.disable();
    }
  }
}

module.exports = BMGameLayer;