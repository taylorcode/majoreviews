angular.module('major')

.controller 'ViewMajor', ($scope, major) ->
	console.log 'Major View'

	$scope.$parent.$parent.previous = name: 'main'

	delete $scope.$parent.search # remove the search

	$scope.major = major
