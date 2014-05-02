(function() {
  angular.module('major', ['ngResource', 'ngRoute', 'ui.router']).config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $provide) {
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
      url: '/majors/:id',
      templateUrl: 'assets/views/major/partials/major.html',
      controller: 'Major as major',
      parent: 'base'
    }).state('otherwise', {
      url: '*path'
    });
    $locationProvider.html5Mode(true);
    return $provide.decorator('$uiViewScroll', function($delegate) {
      return function(uiViewElement) {
        return $(window).scrollTop(0);
      };
    });
  }).run(function($rootScope, $timeout) {
    FastClick.attach(document.body);
    return $rootScope.$on('$stateChangeSuccess', function(ev, state) {
      return $rootScope.currentState = state;
    });
  });

}).call(this);
