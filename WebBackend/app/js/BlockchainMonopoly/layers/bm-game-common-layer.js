var BMLayer = require('../abstract/bm-layer.js');
var BlockchainInterface = require('../backend/blockchain-interface.js');
var konvaUtils = require('../../utils/konva-utils.js');

class BMGameCommonLayer extends BMLayer {
  constructor(stage, gameManager, index, options={}) {
    options.listening = false;
    super(stage, gameManager, index, options);

    this.moveToTop();

    this.tooltip = new Konva.Label({
      x: 0,
      y: 0,
      opacity: 0.75,
      visible: false,
      listening: false
    });
    this.add(this.tooltip);

    this.tooltip.add(
      new Konva.Tag({
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5,
        listening: false
      })
    );

    this.tooltip.add(
      new Konva.Text({
        text: '',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
        listening: false
      })
    );
  }

  getCityTextInformation(city) {
    var info = "";
    info += city.data.name + '\n';
    info += "Price: " + city.data.price + "\n";
    info += "Owner: ";
    info += city.data.owner ? city.data.owner : "No Owner yet"
    info += '\n';
    info += "Treasure: " + city.data.treasure + "\n";
    return info;
  }

  showTooltip(city) {
    this.tooltip.x(city.view.x());
    this.tooltip.y(city.view.y());
    
    this.tooltip.getText().setText(this.getCityTextInformation(city));

    konvaUtils.enableNode(this.tooltip);

    this.draw();
  }

  hideTooltip() {
    this.tooltip.getText().setText(""); 
    
    konvaUtils.disableNode(this.tooltip);

    this.draw();
  }

  scale(scale) {
    super.scale(scale);

    this.tooltip.scale({x: 1.0 / scale.x, y: 1.0 / scale.y});
    
    this.enable();
  }
}

module.exports = BMGameCommonLayer;