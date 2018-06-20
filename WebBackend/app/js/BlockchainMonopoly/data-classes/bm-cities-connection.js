var basics = require('../../utils/basics.js');

class BMCitiesConnection extends Konva.Line {
  
  static initialStrokeWidth() { return 1.0; }
  static initialDash() { return [ 10, 10 ]; }

  constructor(city0, city1) {
    super({});

    this.city0 = city0;
    this.city1 = city1;

    this.city0.connections.push(this);
    this.city1.connections.push(this);

    // Choose the max layer between the two cities
    this.layer = 
      this.city0.layer.layerIndex === Math.max(
        this.city0.layer.layerIndex, this.city1.layer.layerIndex) 
          ? this.city0.layer : this.city1.layer;

    // Define the line here
    this.points([
      this.city0.view.x(), this.city0.view.y(), 
      this.city1.view.x(), this.city1.view.y() 
    ]);
    this.stroke('black');
    this.lineCap('round');
    this.lineJoin('round');
    
    this.layer.add(this);
    this.moveToBottom();
  }

  destroyJSObject() {
    basics.destroyObject(this);
  }

  scale(scale) {
    var scale = scale.x;

    var newStrokeWidth = BMCitiesConnection.initialStrokeWidth() / scale;
    var newDash = BMCitiesConnection.initialDash();
    for (var i = 0; i < newDash.length; i++) {
      newDash[i] /= scale;
    }

    this.strokeWidth(newStrokeWidth);
    this.dash(newDash);
  }
}

module.exports = BMCitiesConnection;