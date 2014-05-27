(function() {
  angular.module('major').directive('mrRating', function() {
    return {
      templateUrl: 'assets/scripts/src/components/partials/mr-rating.html',
      restrict: 'E',
      scope: {
        rating: '=',
        maxRating: '@',
        ratingChanged: '&',
        allowChange: '@'
      },
      link: function(scope) {
        var maxRating;
        maxRating = scope.maxRating || 5;
        scope.rate = function(rating) {
          if (scope.allowChange !== 'true') {
            return;
          }
          scope.rating = rating;
          return scope.ratingChanged({
            newRating: rating
          });
        };
        return scope.$watch('rating', function(oldVal, newVal) {
          var i, rating, remainder, star;
          if (!newVal) {
            return;
          }
          scope.stars = [];
          rating = scope.rating;
          i = 0;
          while (i < maxRating) {
            remainder = i - rating;
            star = {
              active: i < rating,
              index: i + 1
            };
            if (remainder > -1 && remainder < 0) {
              star.remainder = remainder;
            }
            scope.stars.push(star);
            i++;
          }
        });
      }
    };
  }).directive('mrRatings', function() {
    return {
      templateUrl: 'assets/scripts/src/components/partials/mr-ratings.html',
      restrict: 'E',
      scope: {
        metrics: '=',
        allowChange: '@'
      }
    };
  });

}).call(this);
