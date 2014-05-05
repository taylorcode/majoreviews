angular.module('major')

.controller 'ViewMajor', ($scope, major) ->
	console.log 'Major View'

	$scope.major = major

	log major, 'CAT FOOOOOD'