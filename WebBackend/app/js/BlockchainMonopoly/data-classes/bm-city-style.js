class BMCityStyle {
  
  static initialSize() { return 32; }
  static circlePlayerSize() { return 0.5; }

  static styleDefault() {
    return {
      circleCityStroke: "black",
      circleCityFill: "white",
      circleCityStrokeWidth: 1.0,

      circlePlayerFill: "black"
    };
  }

  static styleOwned() {
    return {
      circlePlayerFill: "red",
      circleCityStrokeWidth: 1.0
    }; 
  }

  static styleCurrent() {
    return {
      circleCityFill: "#4286f4",
      circleCityStrokeWidth: 1.0
    }; 
  }

  static styleNear() {
    return {
      circleCityStroke: "red",
      circleCityStrokeWidth: 4.0
    }; 
  }

  static styleClear() {
    return {
      circleCityStroke: "white",
      circleCityFill: "white"
    }
  }

  constructor(style) {
    this.setStyle(BMCityStyle.styleDefault());
    if (style) {
      this.setStyle(style);
    }
  }

  setStyle(style) {
    var styleProperties = Object.keys(style);
    var nbStyleProperties = styleProperties.length;
    for (var i = 0; i < nbStyleProperties; i++) {
      var styleProperty = styleProperties[i];
      this[styleProperty] = style[styleProperty];
    }
  }

  update(circleCity, circlePlayer) {
    circleCity.stroke(this.circleCityStroke);
    circleCity.fill(this.circleCityFill);
    circleCity.strokeWidth(this.circleCityStrokeWidth);

    circlePlayer.fill(this.circlePlayerFill);
  }
}

module.exports = BMCityStyle;