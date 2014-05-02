angular.module('major')

.controller 'Main', ($scope, $filter) ->
	console.log 'Main View'


	log $filter 'camelCaseToDash'

	$scope.majors = [
		_id: 1
		title: 'Civil Engineering'
		description: 'This major is the study of  sh and their relation to society. It covers how to eat  sh with smores and how to build structures that  sh can swim within. There is nothing good about this major primarily because only farm animals teach the classes. Occasionally students enjoy this major, but only if they are indeed farm animals. Some students are farm animals, and these students enjoy Civil Engineering.'
		rating:
			overall: 3.2
			challenging: 3
			current: 4
			useful: 3
			job: 3.6
	,
		_id: 2
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	,
		title: 'Agricultural Business'
	]