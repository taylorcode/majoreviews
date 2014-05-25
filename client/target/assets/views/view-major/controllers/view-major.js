(function() {
  angular.module('major').controller('ViewMajor', function($scope, major) {
    console.log('Major View');
    $scope.$parent.$parent.previous = {
      name: 'main'
    };
    delete $scope.$parent.search;
    return $scope.major = major;
  });

}).call(this);
