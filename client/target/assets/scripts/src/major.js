(function() {
  angular.module('major').controller('MajorReviews', function($scope, $state, $stateParams, $location, $http) {
    log('MajorReviews Controller Initialized');
    this.$state = $state;
    return this.$location = $location;
  });

}).call(this);
