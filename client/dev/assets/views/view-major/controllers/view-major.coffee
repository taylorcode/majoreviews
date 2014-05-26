angular.module('major')

.controller 'ViewMajor', ($scope, major) ->
	console.log 'Major View'

	#delete $scope.$parent.$parent.search # remove the search

	delete $scope.$parent.$parent.$parent.search

	$scope.major = major
