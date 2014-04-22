major.controller 'Major', ($route, $routeParams, $location, $scope, $http) ->
    log 'Major Controller Initialized'
    @$route = $route
    @$location = $location
    @$routeParams = $routeParams