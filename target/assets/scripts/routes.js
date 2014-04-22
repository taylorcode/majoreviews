(function() {
  window.major = angular.module('major', ['ngResource', 'ngRoute', 'ngTouch', 'ui.router']).config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('base', {
      templateUrl: 'assets/views/base/partials/base.html',
      controller: 'Base as base'
    }).state('main', {
      url: '/',
      templateUrl: 'assets/views/main/partials/main.html',
      controller: 'Main as main',
      parent: 'base'
    }).state('major', {
      url: '/major/:id',
      templateUrl: 'assets/views/major/partials/major.html',
      controller: 'Major as major',
      parent: 'base'
    }).state('otherwise', {
      url: '*path'
    });
    return $locationProvider.html5Mode(true);
  });

}).call(this);
