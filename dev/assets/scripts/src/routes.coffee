angular.module('major', ['ngResource', 'ngRoute', 'ui.router'])

.config ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $provide) ->

  $urlRouterProvider.otherwise '/'

  $stateProvider

  .state 'base',
    templateUrl: 'assets/views/base/partials/base.html'
    controller: 'Base as base'

  .state 'main',
    url: '/'
    templateUrl: 'assets/views/main/partials/main.html'
    controller: 'Main as main'
    parent: 'base'

  .state 'major',
    url: '/majors/:id'
    templateUrl: 'assets/views/major/partials/major.html'
    controller: 'Major as major'
    parent: 'base'

  .state 'otherwise',
    url: '*path'
    # redirectTo: '/signup' OTHERWISE SHOW 404 PAGE

  $locationProvider.html5Mode true

  $provide.decorator '$uiViewScroll', ($delegate) ->
    (uiViewElement) ->
      $(window).scrollTop 0


.run ($rootScope, $timeout) ->
  FastClick.attach document.body
  $rootScope.$on '$stateChangeSuccess', (ev, state) ->
    $rootScope.currentState = state
