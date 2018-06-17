var BMCityStyle = require('./bm-city-style.js');
var stringUtils = require('../../utils/string-utils.js');
var mathUtils = require('../../utils/math-utils.js');
var constants = require('../../utils/constants.js');

class BMCityView extends Konva.Group {
  static GroupSize() { return 32; }

  constructor(stage, city, layer, style) {
    var cityNormalizedCoords = mathUtils.lonlat2coord(city.data.lon, city.data.lat);

    super({
      x: cityNormalizedCoords.x * stage.width(),
      y: cityNormalizedCoords.y * stage.height(),
      width: BMCityView.GroupSize(),
      height: BMCityView.GroupSize(),
      draggable: false,
      listening: true
    });

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

  removeEvents() {
    this.off('mouseenter');
    this.off('mouseout');
    this.off('click');
  }

  clearView() {
    this.setStyle(BMCityStyle.styleClear());
    this.draw();
  }

  setOwnedCity() {
    this.city.ownedByPlayer = true;
    if (!this.currentCityPlayer) {
      this.setStyle(BMCityStyle.styleOwned());
    }
  }

  setCurrentCity() {
    var labelCurrentCity = new Konva.Label({
      x: 0,
      y: - BMCityView.GroupSize() / 2,
      opacity: 0.85,
      visible: true,
      listening: false
    });
    this.add(labelCurrentCity);
    labelCurrentCity.add(
      new Konva.Tag({
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        cornerRadius: 10,
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5,
        listening: false
      })
    );
    labelCurrentCity.add(
      new Konva.Text({
        text: 'You are here',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
        listening: false
      })
    );

    this.setStyle(BMCityStyle.styleCurrent());
  }

  setNearCity() {
    var setDefaultStyle;
    var setNearStyle; 
    var blinkTime = 500;
    
    setDefaultStyle = (function() {
      this.clearView();
      this.setStyle(BMCityStyle.styleDefault());
      this.draw();
      setTimeout(
        (function() {
          setNearStyle();
        }).bind(this), blinkTime
      );
    }).bind(this);

    setNearStyle = (function() {
      this.clearView();
      this.setStyle(BMCityStyle.styleNear());
      this.draw();
      setTimeout(
        (function() {
          setDefaultStyle();
        }).bind(this), blinkTime
      );
    }).bind(this);

    setNearStyle();
  }

  setStyle(style) {
    this.style.setStyle(style);
    this.style.update(this.circleCity, this.circlePlayer);
  }
}

module.exports = BMCityView;