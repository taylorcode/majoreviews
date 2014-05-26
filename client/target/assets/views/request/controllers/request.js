(function() {
  angular.module('major').controller('Request', function($scope, $stateParams, $filter, mrApi, $state) {
    var majorId;
    majorId = $scope.majorId = $stateParams.id;
    this.requestReview = function(email) {
      var majorTitle;
      majorTitle = $filter('hyphenToSpaces')(majorId);
      return mrApi.request.save({
        major: majorTitle,
        email: email
      }, function() {
        return $state.go('requestSuccess', {
          id: majorId
        });
      }, function(error) {
        return $scope.error = {
          message: 'email domain must be ' + error.data.message
        };
      });
    };
    this.clearError = function(error) {
      return delete $scope.error;
    };
    return this;
  });

}).call(this);
