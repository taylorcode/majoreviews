(function() {
  angular.module('major').controller('Base', function($scope, majors, $state) {
    log('base controller active');
    $scope.majors = majors;
    return this;
  });

}).call(this);
