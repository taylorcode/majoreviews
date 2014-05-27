(function() {
  angular.module('major').factory('mediaQueries', function() {
    var Mq;
    Mq = function(resolutions) {
      return function(scope) {
        var $w;
        $w = $(window);
        return $w.on('resize orientationchange', function() {
          var sizes, width;
          width = $w.width();
          sizes = {};
          _.each(resolutions, function(res, media) {
            sizes[media] = false;
            if ((res.length === 1 && width >= res[0]) || (res.length === 2 && width >= res[0] && width <= res[1])) {
              return sizes[media] = true;
            }
          });
          return scope.$apply(function() {
            if (!scope.media) {
              scope.media = {};
            }
            scope.media.width = $w.width();
            return scope.media.sizes = sizes;
          });
        }).trigger('resize');
      };
    };
    return function(resolutions) {
      var monitor;
      return monitor = Mq(resolutions);
    };
  });

}).call(this);
