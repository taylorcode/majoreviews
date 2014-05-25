angular.module('major')

.controller 'Base', ($scope, majors, $state) ->
	log 'base controller active'
	$scope.majors = majors
	@