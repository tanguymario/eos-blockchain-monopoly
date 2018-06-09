var constants = require('../../utils/constants.js');

class BMEventsManager {
  constructor(stage) {
    this.stage = stage;
    this.gameManager = undefined;

    this.pos = {
      x: 0,
      y: 0
    };

    this.scale = 1.0;
    this.zoom = {
      min: 1.0,
      max: 100.0,
      factor: 0.95
    };

    this.isDragging = false;
    this.mousePos;

    // We prevent the stage to show the context menu on right click
    this.stage.on('contentContextmenu', 
      (function(e) { 
        e.evt.preventDefault();
      }).bind(this)
    );
  }

  initialize(gameManager) {
    this.gameManager = gameManager;

    var eventsNode = this.stage;

    eventsNode.on('wheel', 
      (function(e) {
        this.onStageWheel(e);
      }).bind(this)
    );
    eventsNode.on('mousedown', 
      (function(e) {
        this.onStageMouseDown(e);
      }).bind(this)
    );
    eventsNode.on('mouseup',
      (function(e) {
        this.onStageMouseUp(e);
      }).bind(this)
    );
    eventsNode.on('mousemove',
      (function(e) {
        this.onStageMouseMove(e);
      }).bind(this)
    );
  }

  isScaleOK(scale) {
    return scale > this.zoom.min && scale < this.zoom.max;
  }

  isPosOK(scale, newPos) {
    return newPos.x < 0 && 
          newPos.y < 0 && 
          (-newPos.x + this.stage.width()) / scale < window.innerWidth && 
          (-newPos.y + this.stage.height()) / scale < window.innerHeight;
  }

  onStageWheel(e) {
    e.evt.preventDefault();
    var mousePos = this.stage.getPointerPosition();
    var mousePointTo = {
      x: mousePos.x / this.scale - this.pos.x / this.scale,
      y: mousePos.y / this.scale - this.pos.y / this.scale,
    };

    var newScale = e.evt.deltaY > 0 ? this.scale * this.zoom.factor : this.scale / this.zoom.factor;
    if (!this.isScaleOK(newScale)) {
      return;
    }

    var newPos = {
      x: -(mousePointTo.x - mousePos.x / newScale) * newScale,
      y: -(mousePointTo.y - mousePos.y / newScale) * newScale
    };

    if (!this.isPosOK(newScale, newPos)) {
      return;
    }

    this.gameManager.getGameLayers().forEach(
      (function(layer) {
        layer.scale({x: newScale, y: newScale});
        layer.position(newPos);
        layer.draw();
      }).bind(this)
    );

    this.pos = newPos;
    this.scale = newScale;
  }

  onStageMouseDown(e) {
    e.evt.preventDefault();
    if (e.evt.button != constants.BTN_LEFT_CLICK) {
      return;
    }

    this.isDragging = true;
    this.mousePos = this.stage.getPointerPosition();
  }

  onStageMouseUp(e) {
    e.evt.preventDefault();
    this.isDragging = false;
  }

  onStageMouseMove(e) {
    e.evt.preventDefault();
    if (!this.isDragging) {
      return;
    }

    var currentMousePos = this.stage.getPointerPosition();
    var mouseDelta = {
      x: currentMousePos.x - this.mousePos.x,
      y: currentMousePos.y - this.mousePos.y,
    };

    var newPos = {
      x: this.pos.x + mouseDelta.x,
      y: this.pos.y + mouseDelta.y
    };

    if (this.isPosOK(this.scale, newPos)) {
      this.gameManager.getGameLayers().forEach(
        (function(layer) {
          layer.position(this.pos);
          layer.draw();
        }).bind(this)
      );
      this.pos = newPos;
    }

    this.mousePos = currentMousePos;
  }
}

module.exports = BMEventsManager;