module.exports = (container) ->
	container.resolve (_, RSVP, School, Major, Review, handler) ->

		create: (req, res, next) ->
			major = req.body
			partialSendResp = null
			partialAssociateMajorWithSchool = null

			sendResp = (major) ->
				res.send major

			# associates a major with a school
			associateMajorWithSchool = (schoolId, majorId) ->
				# doesn't have a promise
				School.updatePromise
					_id: schoolId
				,
					$addToSet:
						majors: majorId

			School.findById(major.school).exec(handler(next).noDocError) # if invalid school, don't save the major
			.then ->
				Major.create(major).then null, handler(next).error
			.then (major) ->
				partialSendResp = sendResp.curry major
				associateMajorWithSchool major.school, major._id
			.then ->
				partialSendResp() # isn't preloaded until the promise, so passing in will pass in null

		query: (req, res, next) ->

			# get the majors lean
			getMajorsLean = ->
				Major.find({}).sort('title').lean().exec handler(next).error

			# group the overall reviews by major id
			avgOveralls = ->
				group = Review.aggregate().group
					_id: '$major'
					overall:
						$avg: '$overall'
				group.exec handler(next).error

			# match the overall review averaged to the majors
			matchAvgsToMajors = (majors, avgs) ->
				_.each majors, (major) -> _.each avgs, (avg) ->
					if major._id.toString() is avg._id.toString()
						major.rating =
							overall: avg.overall
				majors

			RSVP.all([getMajorsLean(), avgOveralls()])
			.then (results) ->
				matchAvgsToMajors results[0], results[1]
			.then (majors) ->
				res.send majors

		get: (req, res, next) ->
			majorId = req.params.id
			partialMatchAvgsToMajor = null

			groupByQuery =
				_id: '$major'
				overall:
					$avg: '$overall'

			_.each Review.schema.paths, (type, path) ->
				metric = path.split('metrics.')[1]
				return if not metric
				groupByQuery[metric] =
					$avg: '$' + path

			averageScores = (majorId) ->
				Review.aggregate().match(major: majorId).group(groupByQuery).exec handler(next).noDocError

			getMajorLean = (majorId) ->
				Major.findByIdOrName(majorId).populate('school')
											 .populate(path: 'reviews', options: sort: '-time')
											 .lean().exec handler(next).noDocError

			matchAvgsToMajor = (major, avgs) ->
				return major if not avgs.length
				avgs = avgs[0]
				delete avgs._id
				major.rating = 
					overall: avgs.overall
					metrics: {}

				delete avgs.overall
				_.each avgs, (avg, key) ->
					major.rating.metrics[key] = avg
				major

			getMajorLean(majorId)
			.then (major) ->
				partialMatchAvgsToMajor = matchAvgsToMajor.curry major
				major._id
			.then (averageScores)
			.then (avgs) ->
				res.send partialMatchAvgsToMajor avgs