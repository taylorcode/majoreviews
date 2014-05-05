angular.module('major')

.controller 'Main', ($scope, $filter, majors) ->
	console.log 'Main View'

	log $filter 'camelCaseToDash'

	$scope.majors = majors