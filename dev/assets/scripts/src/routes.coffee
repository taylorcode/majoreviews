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
    resolve:
      majors: (mrApi) ->
        mrApi.major.query().$promise

  .state 'viewMajor',
    url: '/majors/:id'
    templateUrl: 'assets/views/major/partials/major.html'
    controller: 'ViewMajor as viewMajor'
    parent: 'base'
    resolve:
      major: (mrApi, $stateParams, $filter) ->

        # get the majorId from major name
        majorTitle = $filter('hyphenToSpaces') $stateParams.id

        mrApi.major.get(_id: majorTitle).$promise

  .state 'request',
    url: '/majors/:id/review'
    templateUrl: 'assets/views/request/partials/request.html'
    controller: 'Request as request'
    parent: 'base'

  .state 'review',
    url: '/review/:requestId'
    templateUrl: 'assets/views/review/partials/review.html'
    controller: 'Review as review'
    parent: 'base'
    resolve: 
      request: (mrApi, $stateParams) ->
        mrApi.request.get(_id: $stateParams.requestId).$promise

  .state 'otherwise',
    url: '*path'
    # redirectTo: '/signup' OTHERWISE SHOW 404 PAGE

  $locationProvider.html5Mode true

  $provide.decorator '$uiViewScroll', ($delegate) ->
    (uiViewElement) ->
      $(window).scrollTop 0


.run ($rootScope, $timeout, mrApi) ->

  window.mrApi = mrApi

  FastClick.attach document.body
  $rootScope.$on '$stateChangeSuccess', (ev, state) ->
    $rootScope.currentState = state
