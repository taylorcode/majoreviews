(function() {
  angular.module('major').controller('RequestReview', function($scope, $stateParams) {
    this.requestReview = function() {
      return alert($stateParams.id);
    };
    return this;
  });

}).call(this);
