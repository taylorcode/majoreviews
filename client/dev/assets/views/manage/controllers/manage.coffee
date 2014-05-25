angular.module('major')

.controller 'Manage', ($scope, $stateParams, $filter, mrApi, $state) ->

	# define previous state characteristics
	if $stateParams.id
		$scope.$parent.previous = name: 'viewMajor', params:  $stateParams.id
	else
		$scope.$parent.previous = name: 'main'

	@requestManage = (email) ->
		mrApi.manage.save email: email
	@