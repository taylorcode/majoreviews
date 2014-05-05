angular.module('major')

.controller 'Review', ($scope, $stateParams, request, mrApi, $location, $filter) ->

	$scope.request = request

	if request.review
		$scope.updateReview = true # we are updating an existing review
	else
		# if there is not an existing review for this request, it's a new review, so prefill defaults
		if not request.review
			request.review =
				overall: 3
				metrics:
					challenging: 3
					current: 3
					useful: 3
					jobPotential: 3

	@submitReview = (request) ->

		mrApi.review.save request, (review) ->
			$location.path 'majors/' + $filter('camelCaseToDash') request.major.title

	@