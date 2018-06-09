var Konva = require('konva');
var konvaUtils = require('../../utils/konva-utils.js')

class BMLayer extends Konva.Layer {
  constructor(stage, gameManager, options={}) {
    super(options);

    this.stage = stage;
    this.gameManager = gameManager;

    this.stage.add(this);
  }

  initialize() { throw "[BMLayer] Abstract! Not implemented"; }
  preload() { throw "[BMLayer] Abstract! Not implemented"; }
  start() { throw "[BMLayer] Abstract! Not implemented"; }
  update() { }

  isEnabled() { return konvaUtils.isNodeEnabled(this); }
  isDisabled() { return !this.isEnabled(); }
  enable() { konvaUtils.enableNode(this); }
  disable() { konvaUtils.disableNode(this); }
}

module.exports = BMLayer;