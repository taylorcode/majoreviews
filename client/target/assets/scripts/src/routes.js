(function() {
  angular.module('major', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.router']).config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $provide) {
    var $http;
    $http = null;
    $httpProvider.interceptors.push(function($q, $rootScope, $injector) {
      return {
        request: function(config) {
          $http = $http || $injector.get('$http');
          $rootScope.pendingRequests = $http.pendingRequests.length;
          return config;
        },
        response: function(response) {
          $http = $http || $injector.get('$http');
          $rootScope.pendingRequests = $http.pendingRequests.length;
          return response;
        }
      };
    });
    $provide.decorator('$state', function($delegate, $rootScope) {
      $rootScope.$on('$stateChangeSuccess', function(ev, state) {
        var previous;
        previous = state.data.previous;
        return $delegate.previous = previous ? $delegate.get(previous) : null;
      });
      return $delegate;
    });
    $provide.decorator('$rootScope', function($delegate, $stateParams) {
      $delegate.$on('$stateChangeSuccess', function() {
        return $delegate.$stateParams = $stateParams;
      });
      return $delegate;
    });
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('base', {
      templateUrl: 'assets/views/base/partials/base.html',
      controller: 'Base as base',
      resolve: {
        majors: function(mrApi) {
          return mrApi.major.query().$promise;
        }
      }
    }).state('inner', {
      templateUrl: 'assets/views/inner/partials/inner.html',
      controller: 'Inner as inner',
      parent: 'base'
    }).state('main', {
      url: '/',
      data: {
        title: 'View Majors'
      },
      templateUrl: 'assets/views/main/partials/main.html',
      controller: 'Main as main',
      parent: 'base'
    }).state('manage', {
      url: '/manage',
      data: {
        title: 'Manage my Reviews',
        previous: 'main'
      },
      templateUrl: 'assets/views/manage/partials/manage.html',
      controller: 'Manage as manage',
      parent: 'inner'
    }).state('manageSuccess', {
      url: '/manage-success',
      data: {
        title: 'Manage Success',
        previous: 'manage'
      },
      templateUrl: 'assets/views/manage-success/partials/manage-success.html',
      controller: 'ManageSuccess as manageSuccess',
      parent: 'inner'
    }).state('review', {
      url: '/review/:requestId',
      data: {
        title: 'Review Major',
        previous: 'viewMajor'
      },
      templateUrl: 'assets/views/review/partials/review.html',
      controller: 'Review as review',
      parent: 'inner',
      resolve: {
        request: function(mrApi, $stateParams, $rootScope) {
          return mrApi.request.get({
            _id: $stateParams.requestId
          }).$promise.then(function(request) {
            $rootScope.$previousStateParams = {
              id: request.major._id
            };
            return request;
          });
        }
      }
    }).state('major', {
      templateUrl: 'assets/views/major/partials/major.html',
      url: '/majors/:id',
      abstract: true,
      controller: 'Major as major',
      parent: 'inner',
      onEnter: function($stateParams, $rootScope) {
        return $rootScope.$previousStateParams = $stateParams;
      }
    }).state('viewMajor', {
      url: '',
      data: {
        title: 'View Major',
        previous: 'main'
      },
      templateUrl: 'assets/views/view-major/partials/view-major.html',
      controller: 'ViewMajor as viewMajor',
      parent: 'major',
      resolve: {
        major: function(mrApi, $stateParams, $filter) {
          var majorTitle;
          majorTitle = $filter('hyphenToSpaces')($stateParams.id);
          return mrApi.major.get({
            _id: majorTitle
          }).$promise;
        }
      }
    }).state('majorOption', {
      abstract: true,
      templateUrl: 'assets/views/major-option/partials/major-option.html',
      controller: 'MajorOption as majorOption',
      parent: 'major'
    }).state('request', {
      url: '/review',
      data: {
        title: 'Request to Review',
        previous: 'viewMajor'
      },
      templateUrl: 'assets/views/request/partials/request.html',
      controller: 'Request as request',
      parent: 'majorOption'
    }).state('requestSuccess', {
      url: '/request-success',
      data: {
        title: 'Request Success',
        previous: 'viewMajor'
      },
      templateUrl: 'assets/views/request-success/partials/request-success.html',
      controller: 'RequestSuccess as requestSuccess',
      parent: 'majorOption'
    }).state('otherwise', {
      url: '*path'
    });
    $locationProvider.html5Mode(true);
    return $provide.decorator('$uiViewScroll', function($delegate, $rootScope) {
      return function(uiViewElement) {
        var pos;
        pos = $rootScope.media.sizes.handhelds ? angular.element('[mr-scroll-anchor]').offset().top : 0;
        return $(window).scrollTop(pos);
      };
    });
  }).run(function($rootScope, mrApi, $state, mediaQueries, $timeout) {
    var loadTimeout, loadTimeoutDuration, resolutions;
    window.mrApi = mrApi;
    window.state = $state;
    loadTimeout = null;
    loadTimeoutDuration = 500;
    $rootScope.$watch('pendingRequests', function(num) {
      return $rootScope.httpLoading = num ? true : false;
    });
    $rootScope.$watch('httpLoading', function(loading) {
      if (loading) {
        return loadTimeout = $timeout(function() {
          return $rootScope.httpDelayed = true;
        }, loadTimeoutDuration);
      }
      $rootScope.httpDelayed = false;
      return $timeout.cancel(loadTimeout);
    });
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function(ev, state) {
      return $rootScope.backwards = $state.previous === state;
    });
    FastClick.attach(document.body);
    resolutions = {
      handhelds: [0, 680],
      small: [681, 999],
      medium: [1000, 1259],
      wide: [1260]
    };
    return mediaQueries(resolutions)($rootScope);
  });

}).call(this);
