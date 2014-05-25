(function() {
  angular.module('major').controller('Request', function($scope, $stateParams, $filter, mrApi, $state) {
    var majorId;
    majorId = $stateParams.id;
    this.requestReview = function(email) {
      var majorTitle;
      majorTitle = $filter('hyphenToSpaces')(majorId);
      mrApi.request.save({
        major: majorTitle,
        email: email
      });
      return $state.go('requestSuccess', {
        id: majorId
      });
    };
    return this;
  });

}).call(this);
