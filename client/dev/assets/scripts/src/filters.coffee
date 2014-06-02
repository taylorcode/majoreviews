angular.module('major')

.filter 'camelCaseToDash', () ->
	(value) ->
		value.replace(/\s+/g, '-').toLowerCase() if value

.filter 'camelCaseToSpaces', () ->
	(value) ->
		value.replace(/([A-Z])/g, ' $1').toLowerCase() if value

.filter 'hyphenToSpaces', () ->
	(value) ->
		value.replace /-/g, ' ' if value

.filter 'toFixed', () ->
	(value, trail) ->
		value.toFixed trail if value