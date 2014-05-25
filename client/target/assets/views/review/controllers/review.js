(function() {
  angular.module('major').controller('Review', function($scope, $stateParams, request, mrApi, $location, $filter) {
    var redirectAfter;
    window.dog = request;
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
    redirectAfter = function() {
      return $location.path('majors/' + $filter('camelCaseToDash')(request.major.title));
    };
    this.submitReview = function(request) {
      return mrApi.review.save(request, redirectAfter);
    };
    this.deleteReview = function(request) {
      var data;
      data = {
        _id: request.updateReview,
        requestId: request._id
      };
      return mrApi.review.remove(data, redirectAfter);
    };
    return this;
  });

}).call(this);
