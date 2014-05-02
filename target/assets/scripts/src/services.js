(function() {
  angular.module('major').filter('camelCaseToDash', function() {
    return function(value) {
      return value.replace(' ', '-').toLowerCase();
    };
  }).filter('camelCaseToSpaces', function() {
    return function(value) {
      return value.replace(/([A-Z])/g, ' $1').toLowerCase();
    };
  }).directive('mrRating', function() {
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
          if (!scope.allowChange) {
            return;
          }
          scope.rating = rating;
          return scope.ratingChanged({
            newRating: rating
          });
        };
        return scope.$watch('rating', function(oldVal, newVal) {
          var i, rating;
          if (!newVal) {
            return;
          }
          scope.stars = [];
          rating = scope.rating;
          i = 0;
          while (i < maxRating) {
            scope.stars.push({
              active: i < rating,
              index: i + 1
            });
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
        metrics: '='
      }
    };
  });

}).call(this);
