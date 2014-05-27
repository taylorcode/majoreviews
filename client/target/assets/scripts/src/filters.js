(function() {
  angular.module('major').filter('camelCaseToDash', function() {
    return function(value) {
      if (value) {
        return value.replace(/\s+/g, '-').toLowerCase();
      }
    };
  }).filter('camelCaseToSpaces', function() {
    return function(value) {
      if (value) {
        return value.replace(/([A-Z])/g, ' $1').toLowerCase();
      }
    };
  }).filter('hyphenToSpaces', function() {
    return function(value) {
      if (value) {
        return value.replace(/-/g, ' ');
      }
    };
  }).filter('toFixed', function() {
    return function(value, trail) {
      if (value) {
        return value.toFixed(trail);
      }
    };
  });

}).call(this);
