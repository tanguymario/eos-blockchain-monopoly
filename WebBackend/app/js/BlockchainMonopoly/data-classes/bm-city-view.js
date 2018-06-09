var BMCityStyle = require('./bm-city-style.js');
var stringUtils = require('../../utils/string-utils.js');
var mathUtils = require('../../utils/math-utils.js');
var constants = require('../../utils/constants.js');

class BMCityView extends Konva.Group {
  constructor(stage, city, layer, style) {
    var cityNormalizedCoords = mathUtils.lonlat2coord(city.data.lon, city.data.lat);

    super({
      x: cityNormalizedCoords.x * stage.width(),
      y: cityNormalizedCoords.y * stage.height(),
      width: 32,
      height: 32,
      draggable: false,
      listening: true
    });

    this.stage = stage;
    this.city = city;

    this.layer = layer;
    this.style = new BMCityStyle(style);
    
    this.layer.add(this);

    this.createKonvaNodes();
    this.attachEvents();

    this.style.update(this.circleCity, this.circlePlayer);
  }

  createKonvaNodes() {
    this.circleCity = new Konva.Circle({
      width: this.width(),
      height: this.height(),
      listening: true,
      draggable: false,
    });
    this.add(this.circleCity);

    this.circlePlayer = new Konva.Circle({
      width: this.width() * 0.5,
      height: this.height() * 0.5,
      draggable: false,
      listening: false,
      visible: !stringUtils.isNullOrEmpty(this.city.data.owner)
    });
    this.add(this.circlePlayer);
  }

  attachEvents() {
    this.on('mouseenter', 
      (function(evt) {
        evt.evt.preventDefault();
        this.city.onMouseEnter(evt);
      }).bind(this)
    );
    
    this.on('mouseout', 
      (function(evt) {
        evt.evt.preventDefault();
        this.city.onMouseOut(evt);
      }).bind(this)
    );
    
    this.on('click',
      (function(evt) {
        evt.evt.preventDefault();
        this.city.onClick(evt);
      }).bind(this)
    );
  }

  setStyle(style) {
    this.style.setStyle(style);
    this.style.update(this.circleCity, this.circlePlayer);
  }
}

module.exports = BMCityView;