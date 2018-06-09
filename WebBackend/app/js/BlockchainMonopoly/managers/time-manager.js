class TimeManager {
  constructor() {
    this.start = undefined;
    this.last = undefined;
    this.totalElapsed = undefined;
    this.elapsedSinceLastLoop = undefined;
    
    // Declare the first call to update function here
    this.update = (function(currentTime) {
      this.start = currentTime;
      this.lastTime = currentTime;
      this.totalElapsed = 0;
      this.elapsedSinceLastLoop = 0;

      // Declare the real update function
      this.update = (function(currentTime) {
        this._update(currentTime);
      }).bind(this);
    }).bind(this);
  }

  _update(currentTime) {
    this.totalElapsed = currentTime - this.start;
    this.elapsedSinceLastLoop = currentTime = this.last;

    this.last = currentTime;
  }
}

module.exports = TimeManager;