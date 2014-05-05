(function() {
  angular.module('major').controller('ViewMajor', function($scope, major) {
    console.log('Major View');
    $scope.major = major;
    return log(major, 'CAT FOOOOOD');
  });

}).call(this);
