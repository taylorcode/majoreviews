(function() {
  angular.module('major').controller('Manage', function($scope, $stateParams, $filter, mrApi, $state) {
    if ($stateParams.id) {
      $scope.$parent.previous = {
        name: 'viewMajor',
        params: $stateParams.id
      };
    } else {
      $scope.$parent.previous = {
        name: 'main'
      };
    }
    this.requestManage = function(email) {
      return mrApi.manage.save({
        email: email
      }, function() {
        return $state.go('manageSuccess');
      });
    };
    return this;
  });

}).call(this);
