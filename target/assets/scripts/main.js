(function() {
  major.controller('Major', function($route, $routeParams, $location, $scope, $http) {
    log('Major Controller Initialized');
    this.$route = $route;
    this.$location = $location;
    return this.$routeParams = $routeParams;
  });

}).call(this);
