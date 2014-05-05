angular.module('major')

.controller 'Request', ($scope, $stateParams, $filter, mrApi) ->
	@requestReview = (email) ->
		majorTitle = $filter('hyphenToSpaces') $stateParams.id
		mrApi.request.save major: majorTitle, email: email
	@