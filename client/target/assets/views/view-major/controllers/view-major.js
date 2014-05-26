(function() {
  angular.module('major').controller('ViewMajor', function($scope, major) {
    console.log('Major View');
    delete $scope.$parent.$parent.$parent.search;
    return $scope.major = major;
  });

}).call(this);
