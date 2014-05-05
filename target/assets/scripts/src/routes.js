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
      parent: 'base',
      resolve: {
        majors: function(mrApi) {
          return mrApi.major.query().$promise;
        }
      }
    }).state('viewMajor', {
      url: '/majors/:id',
      templateUrl: 'assets/views/major/partials/major.html',
      controller: 'ViewMajor as viewMajor',
      parent: 'base',
      resolve: {
        major: function(mrApi, $stateParams, $filter) {
          var majorTitle;
          majorTitle = $filter('hyphenToSpaces')($stateParams.id);
          return mrApi.major.get({
            _id: majorTitle
          }).$promise;
        }
      }
    }).state('request', {
      url: '/majors/:id/review',
      templateUrl: 'assets/views/request/partials/request.html',
      controller: 'Request as request',
      parent: 'base'
    }).state('review', {
      url: '/review/:requestId',
      templateUrl: 'assets/views/review/partials/review.html',
      controller: 'Review as review',
      parent: 'base',
      resolve: {
        request: function(mrApi, $stateParams) {
          return mrApi.request.get({
            _id: $stateParams.requestId
          }).$promise;
        }
      }
    }).state('otherwise', {
      url: '*path'
    });
    $locationProvider.html5Mode(true);
    return $provide.decorator('$uiViewScroll', function($delegate) {
      return function(uiViewElement) {
        return $(window).scrollTop(0);
      };
    });
  }).run(function($rootScope, $timeout, mrApi) {
    window.mrApi = mrApi;
    FastClick.attach(document.body);
    return $rootScope.$on('$stateChangeSuccess', function(ev, state) {
      return $rootScope.currentState = state;
    });
  });

}).call(this);
