(function() {
  angular.module('major').controller('Request', function($scope, $stateParams, $filter, mrApi) {
    this.requestReview = function(email) {
      var majorTitle;
      majorTitle = $filter('hyphenToSpaces')($stateParams.id);
      return mrApi.request.save({
        major: majorTitle,
        email: email
      });
    };
    return this;
  });

}).call(this);
