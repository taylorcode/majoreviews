angular.module('major')

.controller 'Inner', ($scope, $state) ->
	log 'inner controller active'

	@