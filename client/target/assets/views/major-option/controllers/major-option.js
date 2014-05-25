(function() {
  angular.module('major').controller('MajorOption', function($scope, $stateParams) {
    return $scope.$parent.$parent.previous = {
      name: 'viewMajor',
      params: {
        id: $stateParams.id
      }
    };
  });

}).call(this);
