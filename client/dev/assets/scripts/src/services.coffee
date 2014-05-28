angular.module('major')

.factory 'mrApi', ($resource) ->
	school: $resource '/api/school/:_id', _id: '@_id'
	major: $resource '/api/major/:_id', _id: '@_id'
	account: $resource '/api/account/:_id', _id: '@_id'
	request: $resource '/api/request/:_id', _id: '@_id'
	manage: $resource '/api/manage'
	review: $resource '/api/review/:_id', _id: '@_id', 
		remove: method: 'PUT'