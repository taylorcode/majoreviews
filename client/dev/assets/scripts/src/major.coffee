angular.module('major')

.controller 'MajorReviews', ($scope, $state, $stateParams, $location, $http) ->
    log 'MajorReviews Controller Initialized'
    @$state = $state
    @$location = $location