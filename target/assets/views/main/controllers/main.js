(function() {
  angular.module('major').controller('Main', function($scope, $filter, majors) {
    console.log('Main View');
    log($filter('camelCaseToDash'));
    return $scope.majors = majors;
  });

}).call(this);
