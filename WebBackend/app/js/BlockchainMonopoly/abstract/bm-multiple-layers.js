var konva = require('konva');
var BMLayer = require('./bm-layer.js');

// TODO make it extends KonvaGroup
class BMMultipleLayers {
  constructor(stage, gameManager, options={}) {
    if (this.__proto__.constructor.name === "BMMultipleLayers") {
      throw "[BMMultipleLayers] Abstract class";
    }
    
    this.stage = stage;
    this.gameManager = gameManager;

    this.layers = [];
  }

  initialize() { throw "[BMMultipleLayers] Abstract! Not implemented"; }
  preload() { throw "[BMMultipleLayers] Abstract! Not implemented"; }
  start() { throw "[BMMultipleLayers] Abstract! Not implemented"; }
  update() { }

  batchDraw() {
   this.layers.forEach(
    (function(layer) {
      layer.batchDraw();
    }).bind(this)
   ); 
  }

  draw() {
   this.layers.forEach(
    (function(layer) {
      layer.draw();
    }).bind(this)
   ); 
  }

  destroy() {
    this.layers.forEach(
      (function(layer) {
        layer.destroy();
      }).bind(this)
    );
  }

  move(delta) {
    this.layers.forEach(
      (function(layer) {
        layer.move(delta);
      }).bind(this)
    );
  }

  position(pos) {
    this.layers.forEach(
      (function(layer) {
        layer.position(pos);
      }).bind(this)
    ); 
  }

  scale(scale) {
   this.layers.forEach(
      (function(layer) {
        layer.scale(scale);
      }).bind(this)
    );
  }

  getActiveLayers() {
    var activeLayers = [];
    this.layers.forEach(
      (function(layer) {
        if (layer.isEnabled()) {
          activeLayers.push(layer);
        }
      }).bind(this)
    );
    return activeLayers;
  }

  getLayerAt(i) { return this.layers[i]; }

  createLayers(nbLayers, options={}) {
    for (var i = 0; i < nbLayers; i++) {
      this.createLayer(options);
    }
  }

  nbLayers() {
    return this.layers.length;
  }

  createLayer(options={}) {
    var layer = new BMLayer(this.stage, this.gameManager, options);
    this.addLayer(layer);
    return layer;
  }

  addLayer(layer) {
    this.layers.push(layer);
    return layer;
  }
}

module.exports = BMMultipleLayers;