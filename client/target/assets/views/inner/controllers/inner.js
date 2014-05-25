(function() {
  angular.module('major').controller('Inner', function($scope, $state) {
    log('inner controller active');
    return this;
  });

}).call(this);
