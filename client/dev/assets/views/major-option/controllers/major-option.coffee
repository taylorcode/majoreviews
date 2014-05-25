angular.module('major')

.controller 'MajorOption', ($scope, $stateParams) ->
	# define previous state characteristics
	$scope.$parent.$parent.previous = name: 'viewMajor', params: id: $stateParams.id
