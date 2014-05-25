(function() {
  angular.module('major').controller('MajorReviews', function($scope, $state, $stateParams, $location, $http) {
    log('MajorReviews Controller Initialized');
    this.$state = $state;
    return this.$location = $location;
  }).filter('camelCaseToDash', function() {
    return function(value) {
      if (value) {
        return value.replace(/\s+/g, '-').toLowerCase();
      }
    };
  }).filter('camelCaseToSpaces', function() {
    return function(value) {
      if (value) {
        return value.replace(/([A-Z])/g, ' $1').toLowerCase();
      }
    };
  }).filter('hyphenToSpaces', function() {
    return function(value) {
      if (value) {
        return value.replace(/-/g, ' ');
      }
    };
  }).filter('toFixed', function() {
    return function(value, trail) {
      if (value) {
        return value.toFixed(trail);
      }
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
  }).directive('timeago', function() {
    return {
      restrict: 'A',
      scope: {
        timeago: '='
      },
      link: function(scope, elem, attrs) {
        elem.timeago();
        return scope.$watch('timeago', function(time) {
          return elem.timeago('update', time);
        });
      }
    };
  }).factory('mrApi', function($resource) {
    return {
      school: $resource('/api/school/:_id', {
        _id: '@_id'
      }),
      major: $resource('/api/major/:_id', {
        _id: '@_id'
      }),
      account: $resource('/api/account/:_id', {
        _id: '@_id'
      }),
      request: $resource('/api/request/:_id', {
        _id: '@_id'
      }),
      manage: $resource('/api/manage'),
      review: $resource('/api/review/:_id', {
        _id: '@_id'
      }, {
        remove: {
          method: 'PUT'
        }
      })
    };
  }).factory('mediaQueries', function() {
    var Mq;
    Mq = function(resolutions) {
      return function(scope) {
        var $w;
        $w = $(window);
        return $w.on('resize orientationchange', function() {
          var sizes, width;
          width = $w.width();
          sizes = {};
          _.each(resolutions, function(res, media) {
            sizes[media] = false;
            if ((res.length === 1 && width >= res[0]) || (res.length === 2 && width >= res[0] && width <= res[1])) {
              return sizes[media] = true;
            }
          });
          return scope.$apply(function() {
            if (!scope.media) {
              scope.media = {};
            }
            scope.media.width = $w.width();
            return scope.media.sizes = sizes;
          });
        }).trigger('resize');
      };
    };
    return function(resolutions) {
      var monitor;
      return monitor = Mq(resolutions);
    };
  });

}).call(this);
