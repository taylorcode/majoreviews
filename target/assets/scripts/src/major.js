(function() {
  angular.module('major').controller('Major', function($scope, $route, $routeParams, $location, $http) {
    log('Major Controller Initialized');
    this.$route = $route;
    this.$location = $location;
    return this.$routeParams = $routeParams;
  });

}).call(this);
