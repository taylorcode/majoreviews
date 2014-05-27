(function() {
  angular.module('major').directive('timeago', function() {
    return {
      restrict: 'A',
      scope: {
        timeago: '='
      },
      link: function(scope, elem, attrs) {
        elem.timeago();
        return scope.$watch('timeago', function(time) {
          return elem.timeago('update', time);
        });
      }
    };
  });

}).call(this);
