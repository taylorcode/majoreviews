angular.module('major')

.directive 'timeago', ->
	restrict: 'A',
	scope:
		timeago: '='
	link: (scope, elem, attrs) ->
		elem.timeago()
		scope.$watch 'timeago', (time) ->
			elem.timeago 'update', time
