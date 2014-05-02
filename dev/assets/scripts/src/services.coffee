angular.module('major')


# TODO these should be moved to correct files and their load order should be changed so it works...

.filter 'camelCaseToDash', () ->
	(value) ->
		value.replace(' ', '-').toLowerCase()

.filter 'camelCaseToSpaces', () ->
	(value) ->
		value.replace(/([A-Z])/g, ' $1').toLowerCase()


.directive 'mrRating', ->
	templateUrl: 'assets/scripts/src/components/partials/mr-rating.html'
	restrict: 'E'
	scope:
		rating: '='
		maxRating: '@'
		ratingChanged: '&'
		allowChange: '@'
	link: (scope) ->

		maxRating = scope.maxRating or 5

		scope.rate = (rating) ->
			return if not scope.allowChange
			scope.rating = rating
			scope.ratingChanged newRating: rating

		scope.$watch 'rating', (oldVal, newVal) ->
			return if not newVal

			scope.stars = []
			rating = scope.rating

			i = 0

			while i < maxRating
				scope.stars.push
					active: i < rating
					index: i + 1
				i++

			return

.directive 'mrRatings', ->
	templateUrl: 'assets/scripts/src/components/partials/mr-ratings.html'
	restrict: 'E'
	scope:
		metrics: '='


# jobagrob.factory 'generator', ($resource) ->
# 	$resource 'api/jobs/:id/generator', id: '@job'

# .factory 'application', ($resource) ->
#   $resource 'api/jobs/:id/application', id: '@id'

# .factory 'jgApi', ($resource) ->
  
#   resumes: $resource 'api/account/resumes/', id: '@_id'

#   job: $resource 'api/jobs/:_id', _id: '@_id'

#   jobBookmarks: $resource '/api/account/jobs/bookmarks/:_id', _id: '@_id'

#   jobApplied: $resource '/api/account/jobs/applied/:_id', _id: '@_id'

#   jobs: $resource 'api/jobs/search/:search', search: '@search'

#   user: $resource 'api/user/:id', search: '@_id'

#   company: $resource 'api/company/:id', search: '@_id'

#   account: $resource 'api/account'

#   login: $resource 'api/login'


#   # job:
#   #   search: $resource 'api/jobs/search/:search', search: '@search'
#   #   a: $resource 'api/jobs/:_id', _id: '@_id'
#   #   applied





#   # bookmark: $resource 'api/jobs/:_id/bookmark', _id: '@_id'


# .factory 'modelResourceComparator', () ->
#   compare: (origs, currents, identifier) ->
#       updated = []
#       deleted = []
#       added = []
#       id = identifier or '_id'

#       # if this original is not in the list of new, then delete it
#       _.each origs, (orig) ->
#         isDeleted = true
#         for cur in currents
#           # if they have the same id, but they are not equal, then update
#           if orig[id] is cur[id]
#             isDeleted = false
#             if not angular.equals orig, cur
#               updated.push _.extend(orig, cur) # want to make sure this is still a resource object, just with the updated values
#               break
#         deleted.push orig if isDeleted

#       _.each currents, (cur) ->
#         # if the cur has no id, then it's new, so add it
#         added.push cur if not cur[id]

#       updated: updated
#       deleted: deleted
#       added: added

#   # Example use:
#   # ------------------
#   # changed = modelResourceComparator.compare origResumes, rs
#   # log changed
#   # _.each changed.added, (item) ->
#   #   saved = resumes.save item, (newItem) ->
#   #     rs[rs.indexOf item] = new resumes newItem #update the item after it is saved so it is a resource object created form the result
#   # _.each changed.updated, (item) ->
#   #   item.$save()
#   # _.each changed.deleted, (item) ->
#   #   item.$delete()



# .factory 'extract', () ->
#   application: (a) ->
#     a = angular.copy a
#     a.fieldsets = _.map(a.fieldsets, (v) ->
#       v.elems = _.map(v.elems, (e) -> 
#         # these define what elements to keep based on the template
#         keepers = {}
#         keepers.textarea =  ['maxlength', 'placeholder']
#         keepers.input = ['fieldType'].concat keepers.textarea
#         keepers.radio = ['opts']
#         keepers.checkbox = keepers.radio
#         keepers.select = keepers.radio

#         keep = ['title', 'required', 'template'].concat keepers[e.props.template]
#         e.props = _.pick e.props, keep

#         _.pick e, 'props'

#       )
#       v
#     )
#     a
#   submittedApplication: (c) ->
#     # TODO Clean this up!
#     c = angular.copy c
#     #c.fieldsets = _.map(c.fieldsets, (v) ->
#     #	_.map(v.elems, (e) ->
#     #		e.props = _.pick e.props, 'value', 'checkboxes'
#     #		e
#     #	)
#     #)
#     c
