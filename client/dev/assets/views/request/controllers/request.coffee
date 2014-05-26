angular.module('major')

.controller 'Request', ($scope, $stateParams, $filter, mrApi, $state) ->
	majorId = $scope.majorId = $stateParams.id

	@requestReview = (email) ->
		majorTitle = $filter('hyphenToSpaces') majorId
		mrApi.request.save major: majorTitle, email: email, ->
			$state.go 'requestSuccess', id: majorId
		, (error) ->
			$scope.error = 
				message: 'email domain must be ' + error.data.message

	@clearError = (error) ->
		delete $scope.error
		
	@