var basics = require('./basics.js');
var exists = basics.exists;
var executeFunctionSafely = basics.executeFunctionSafely;

class KonvaImages {
  constructor(options={}) {
    this.data = {};
    this.isFinished = false;
  }

  add(imgSrc, ...konvaNodes) {
    if (konvaNodes.length === 0) {
      return;
    } else if (konvaNodes.length === 1) {
      konvaNodes = konvaNodes[0];
    }

    if (!exists(this.data[imgSrc])) {
      this.data[imgSrc] = {
        konvaNodes: [],
        img: null
      };
    }

    this.data[imgSrc].konvaNodes = this.data[imgSrc].konvaNodes.concat(konvaNodes);
  }

  nb() {
    return Object.keys(this.data).length;
  }

  _endLoading(callbackOnEnd) {
    this.isFinished = true;
    executeFunctionSafely(callbackOnEnd, this.data);
  }

  load(callbackOnImg, callbackOnEnd, setNodesImgs=true) {
    var imgSrcs = Object.keys(this.data);
    var nbImgsToLoad = imgSrcs.length;
    var nbImagesDone = 0;

    if (nbImgsToLoad === nbImagesDone) {
      this._endLoading();
    }

    var onImageDone = (function() {
      nbImagesDone++;
      if (nbImgsToLoad === nbImagesDone) {
        this._endLoading(callbackOnEnd);
      }
    }).bind(this);

    imgSrcs.forEach(
      (function(imgSrc) {
        var konvaNodes = this.data[imgSrc].konvaNodes;
        var img = this.data[imgSrc] = new Image();

        img.onload = (function() {
          if (setNodesImgs) {
            var nbKonvaNodes = konvaNodes.length;
            for (var i = 0; i < nbKonvaNodes; i++) {
              var konvaNode = konvaNodes[i];

              if (!(konvaNode instanceof Konva.Image)) {
                console.warn("[KonvaImages] Not a Konva.Image object");
                continue;
              }

              konvaNode.image(this);
              executeFunctionSafely(callbackOnImg, this.data);
            }
          }
          onImageDone();
        });

        img.onerror = (function() {
          console.error("[KonvaImages] Could not load at: " + img.src);
          onImageDone();
        });
        img.src = imgSrc;
      }).bind(this)
    );
  }
}

module.exports = KonvaImages;