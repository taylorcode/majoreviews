(function() {
  angular.module('major').controller('Review', function($scope, $stateParams, request, mrApi, $location, $filter) {
    $scope.request = request;
    if (request.review) {
      $scope.updateReview = true;
    } else {
      if (!request.review) {
        request.review = {
          overall: 3,
          metrics: {
            challenging: 3,
            current: 3,
            useful: 3,
            jobPotential: 3
          }
        };
      }
    }
    this.submitReview = function(request) {
      return mrApi.review.save(request, function(review) {
        return $location.path('majors/' + $filter('camelCaseToDash')(request.major.title));
      });
    };
    return this;
  });

}).call(this);
