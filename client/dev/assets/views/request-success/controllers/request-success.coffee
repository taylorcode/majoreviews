angular.module('major')

.controller 'RequestSuccess', ($scope, $stateParams, $filter, mrApi) ->
	log 'Request success loaded'