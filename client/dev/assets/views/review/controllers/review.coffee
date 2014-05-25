angular.module('major')

.controller 'Review', ($scope, $stateParams, request, mrApi, $location, $filter) ->
	
	window.dog = request

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

	redirectAfter = ->
		$location.path 'majors/' + $filter('camelCaseToDash') request.major.title

	@submitReview = (request) ->
		mrApi.review.save request, redirectAfter

	@deleteReview = (request) ->
		data = 
			_id: request.updateReview
			requestId: request._id
		mrApi.review.remove data, redirectAfter

	@