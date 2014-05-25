angular.module('major')

.controller 'Major', ($scope) ->
	log 'major controller active'
	$scope.$parent.previous = name: 'main'