(function() {
  angular.module('major').controller('Major', function($scope) {
    log('major controller active');
    return $scope.$parent.previous = {
      name: 'main'
    };
  });

}).call(this);
