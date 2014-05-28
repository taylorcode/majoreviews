angular.module('major')

.directive 'mrRating', ->
	templateUrl: 'assets/scripts/src/components/partials/mr-rating.html'
	restrict: 'E'
	scope:
		rating: '='
		maxRating: '@'
		ratingChanged: '&'
		allowChange: '@'
	link: (scope) ->

		maxRating = scope.maxRating or 5

		scope.rate = (rating) ->
			return if scope.allowChange isnt 'true'
			scope.rating = rating
			scope.ratingChanged newRating: rating

		scope.$watch 'rating', (oldVal, newVal) ->
			return if not newVal

			scope.stars = []
			rating = scope.rating

			i = 0

			while i < maxRating

				remainder = i - rating

				star = 
					active: i < rating
					index: i + 1

				# add the remainder if there is one
				star.remainder = remainder if remainder > -1 and remainder < 0

				scope.stars.push star
				i++

			return

.directive 'mrRatings', ->
	templateUrl: 'assets/scripts/src/components/partials/mr-ratings.html'
	restrict: 'E'
	scope:
		metrics: '='
		allowChange: '@'