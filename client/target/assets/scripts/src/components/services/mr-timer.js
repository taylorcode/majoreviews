(function() {
  angular.module('major').factory('mrTimer', function() {
    var Timer, requestAnimationFrame;
    requestAnimationFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(f) {
        return window.setTimeout(f, 1e3 / 60);
      };
    })();
    Timer = function(fps) {
      this.fps = fps;
      this.then = Date.now();
      this.now = null;
      this.go = true;
      this.callbacks = [];
    };
    Timer.prototype.add = function(cb) {
      this.callbacks.push(cb);
    };
    Timer.prototype.remove = function(cb) {
      var index;
      index = this.callbacks.indexOf(cb);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
    Timer.prototype._invokeCallbacks = function() {
      var i;
      i = 0;
      while (i < this.callbacks.length) {
        this.callbacks[i]();
        i++;
      }
    };
    Timer.prototype.loop = function() {
      var delta, interval;
      if (!this.go) {
        return;
      }
      requestAnimationFrame((function(_this) {
        return function() {
          return _this.loop();
        };
      })(this));
      this.now = Date.now();
      delta = this.now - this.then;
      interval = 1000 / this.fps;
      if (delta > interval) {
        this.then = this.now - (delta % interval);
        return this._invokeCallbacks();
      }
    };
    Timer.prototype.start = function() {
      this.go = true;
      return this.loop();
    };
    Timer.prototype.stop = function() {
      return this.go = false;
    };
    return function(fps) {
      return new Timer(fps);
    };
  });

}).call(this);
