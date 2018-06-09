var BMLayer = require('../abstract/bm-layer.js');
var JSONLoader = require('../../utils/json-loader.js');
var mathUtils = require('../../utils/math-utils.js');

class BMMapLayer extends BMLayer {
  constructor(stage, gameManager, options={}) {
    options.listening = false;
    super(stage, gameManager, options);
  }

  initialize() {
    this.addBackground();

    this.mapStroke = 'rgb(0, 0, 0)';
    this.mapStrokeWidth = 0.1;
    this.mapFill = '#00cc00';
  }

  preload() {
    this.gameManager.addJSONLoader(
      new JSONLoader('assets/json/worldLandsData.json', {
        callbackSuccess: 
          (function(landsJSON) { 
            this.createMap(landsJSON); 
          }).bind(this)
      })      
    );
  }

  start() {
    this.moveToBottom();
  }

  addBackground() {
    this.background = new Konva.Rect({
      x: 0, 
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: '#3399ff'
    });
    this.add(this.background);
  }

  drawPolygon(polygon) {
    var getPointOnMap = (function(array, i) {
      var p = {
        x:  array[i][0],
        y:  array[i][1]
      };
    
      p = mathUtils.lonlat2coord(p.x, p.y);
    
      p.x *= this.stage.width();
      p.y *= this.stage.height();

      return p;
    }).bind(this);

    var nbPoints = polygon.length;
    if (nbPoints == 0) {
      return;
    }

    var svgString = "";
    var p = getPointOnMap(polygon, 0);
    svgString += "M " + p.x.toString() + "," + p.y.toString() + " ";
    for (var i = 1; i < nbPoints - 1; i++) {
      p = getPointOnMap(polygon, i);
      svgString += "L " + p.x.toString() + ',' + p.y.toString() + ' ';
    }
    svgString += "Z";

    this.map = new Konva.Path({
      data: svgString,
      stroke: this.mapStroke,
      strokeWidth: this.mapStrokeWidth,
      fill: this.mapFill
    });
    this.add(this.map);
  }

  createMap(landsJSON) {
    landsJSON.lands.forEach( 
      (function(land) {
        this.drawPolygon(land);
      }).bind(this)
    );
  }
}

module.exports = BMMapLayer;