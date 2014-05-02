angular.module('major')

.controller 'Major', ($scope) ->
	console.log 'Major View'

	$scope.major =
		_id: 1
		title: 'Civil Engineering'
		description: 'This major is the study of  sh and their relation to society. It covers how to eat  sh with smores and how to build structures that  sh can swim within. There is nothing good about this major primarily because only farm animals teach the classes. Occasionally students enjoy this major, but only if they are indeed farm animals. Some students are farm animals, and these students enjoy Civil Engineering.'
		overall: 3
		metrics:
			challenging: 3
			current: 4
			useful: 3
			jobPotential: 3
		reviews: [
			time: 'two days ago'
			summary: 'This major is a complete joke. Every class is a repetition of the previous class, and the students all stupid. Everyone cheats on all of the  nals, midterms, and stu . Reallly stupid. I left the major after a few weeks and instead switched to vine and stuff.'
			overall: 3
			metrics:
				challenging: 3
				current: 4
				useful: 3
				jobPotential: 3
		,
			time: 'two days ago'
			summary: 'This major is a complete joke. Every class is a repetition of the previous class, and the students all stupid. Everyone cheats on all of the  nals, midterms, and stu . Reallly stupid. I left the major after a few weeks and instead switched to vine and stuff.'
			overall: 3
			metrics:
				challenging: 3
				current: 4
				useful: 3
				jobPotential: 3
		,
			time: 'two days ago'
			summary: 'This major is a complete joke. Every class is a repetition of the previous class, and the students all stupid. Everyone cheats on all of the  nals, midterms, and stu . Reallly stupid. I left the major after a few weeks and instead switched to vine and stuff.'
			overall: 3
			metrics:
				challenging: 3
				current: 4
				useful: 3
				jobPotential: 3
		,
			time: 'two days ago'
			summary: 'This major is a complete joke. Every class is a repetition of the previous class, and the students all stupid. Everyone cheats on all of the  nals, midterms, and stu . Reallly stupid. I left the major after a few weeks and instead switched to vine and stuff.'
			overall: 3
			metrics:
				challenging: 3
				current: 4
				useful: 3
				jobPotential: 3
		]