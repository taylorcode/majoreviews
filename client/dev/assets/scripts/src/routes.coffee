angular.module('major', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.router'])

.config ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $provide) ->

  # response interceptor for loading
  $httpProvider.interceptors.push ($q, $rootScope) ->

    $rootScope.httpLoadCount = $rootScope.httpLoadedCount = 0

    request: (config) ->
      $rootScope.httpLoadCount++
      $rootScope.httpLoading = true
      config
    response: (response) ->
      $rootScope.httpLoadedCount++
      if $rootScope.httpLoadCount is $rootScope.httpLoadedCount
        $rootScope.httpLoading = false
        $rootScope.httpLoadCount = $rootScope.httpLoadedCount = 0
      response
    # requestError: ->
    #   log arguments
    # responseError: ->
    #   log arguments

  $provide.decorator '$state', ($delegate, $rootScope) ->
    $rootScope.$on '$stateChangeSuccess', (ev, state) ->
      # set the previous state using state data
      previous = state.data.previous
      $delegate.previous = if previous then $delegate.get previous else null
    $delegate

  # decorate rootScope with the $state object, the $stateParams, watch for change of state and set navigation direction
  $provide.decorator '$rootScope', ($delegate, $stateParams) ->
    $delegate.$on '$stateChangeSuccess', ->
      $delegate.$stateParams = $stateParams
    $delegate

  $urlRouterProvider.otherwise '/'

  $stateProvider

  .state 'base',
    templateUrl: 'assets/views/base/partials/base.html'
    controller: 'Base as base'
    resolve:
      majors: (mrApi) ->
        mrApi.major.query().$promise

  # inner has a back button
  # goes to the home
  .state 'inner',
    templateUrl: 'assets/views/inner/partials/inner.html'
    controller: 'Inner as inner'
    parent: 'base'

  .state 'main',
    url: '/'
    data:
      title: 'View Majors'
    templateUrl: 'assets/views/main/partials/main.html'
    controller: 'Main as main'
    parent: 'base'

  .state 'manage',
    url: '/manage' # update - TODO - optional params has been changed: http://stackoverflow.com/questions/21977598/optional-params-in-angularjs-states-views-with-ui-router
    data:
      title: 'Manage my Reviews'
      previous: 'main'
    templateUrl: 'assets/views/manage/partials/manage.html'
    controller: 'Manage as manage'
    parent: 'inner'

  .state 'manageSuccess',
    url: '/manage-success'
    data:
      title: 'Manage Success'
      previous: 'manage'
    templateUrl: 'assets/views/manage-success/partials/manage-success.html'
    controller: 'ManageSuccess as manageSuccess'
    parent: 'inner'

  .state 'review',
    url: '/review/:requestId'
    data:
      title: 'Review Major'
      previous: 'viewMajor'
    templateUrl: 'assets/views/review/partials/review.html'
    controller: 'Review as review'
    parent: 'inner'
    resolve: 
      request: (mrApi, $stateParams, $rootScope) ->
        mrApi.request.get(_id: $stateParams.requestId).$promise
        .then (request) ->
          $rootScope.$previousStateParams = id: request.major._id
          request

  # majors back button goes to the major
  .state 'major',
    templateUrl: 'assets/views/major/partials/major.html'
    url: '/majors/:id'
    abstract: true
    controller: 'Major as major'
    parent: 'inner'
    onEnter: ($stateParams, $rootScope) ->
      $rootScope.$previousStateParams = $stateParams

  .state 'viewMajor',
    url: ''
    data:
      title: 'View Major'
      previous: 'main'
    templateUrl: 'assets/views/view-major/partials/view-major.html'
    controller: 'ViewMajor as viewMajor'
    parent: 'major'
    resolve:
      major: (mrApi, $stateParams, $filter) ->
        # get the majorId from major name
        majorTitle = $filter('hyphenToSpaces') $stateParams.id
        mrApi.major.get(_id: majorTitle).$promise

  .state 'majorOption',
    abstract: true
    templateUrl: 'assets/views/major-option/partials/major-option.html'
    controller: 'MajorOption as majorOption'
    parent: 'major'

  .state 'request',
    url: '/review'
    data:
      title: 'Request to Review'
      previous: 'viewMajor'
    templateUrl: 'assets/views/request/partials/request.html'
    controller: 'Request as request'
    parent: 'majorOption'

  .state 'requestSuccess',
    url: '/request-success'
    data:
      title: 'Request Success'
      previous: 'viewMajor'
    templateUrl: 'assets/views/request-success/partials/request-success.html'
    controller: 'RequestSuccess as requestSuccess'
    parent: 'majorOption'

  .state 'otherwise',
    url: '*path'
    # redirectTo: '/signup' OTHERWISE SHOW 404 PAGE

  $locationProvider.html5Mode true

  $provide.decorator '$uiViewScroll', ($delegate, $rootScope) ->
    (uiViewElement) ->
      # todo - should DOM manipulations be occuring here...
      pos = if $rootScope.media.sizes.handhelds then angular.element('[mr-scroll-anchor]').offset().top else 0
      $(window).scrollTop pos

.run ($rootScope, mrApi, $state, mediaQueries, $timeout) ->

  window.mrApi = mrApi
  window.state = $state

  $rootScope.viewTransitionDuration = 500

  $rootScope.$watch 'httpLoadedCount', (loaded) ->
    log loaded, $rootScope.httpLoadCount
    log 'LOADED PERCENT' + (loaded / $rootScope.httpLoadCount)

  # check if previous state to active state is the next state
  $rootScope.$on '$stateChangeStart', (ev, state) ->
    $rootScope.backwards = $state.previous is state

  FastClick.attach document.body

  resolutions =
    handhelds: [0, 680]
    small: [681, 999]
    medium: [1000, 1259]
    wide: [1260]
  # monitor resolutions and publish on rootScope 
  mediaQueries(resolutions)($rootScope)




