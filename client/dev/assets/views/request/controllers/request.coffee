angular.module('major')

.controller 'Request', ($scope, $stateParams, $filter, mrApi, $state) ->
	majorId = $stateParams.id

	@requestReview = (email) ->
		majorTitle = $filter('hyphenToSpaces') majorId
		mrApi.request.save major: majorTitle, email: email
		$state.go 'requestSuccess', id: majorId
	@