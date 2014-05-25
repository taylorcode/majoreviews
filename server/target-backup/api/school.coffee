module.exports = (container) ->
	container.resolve (School, handler) ->
		create: (req, res, next) ->
			# this needs an error handler
			School.create(req.body).then (school) ->
				res.send school
			, handler(next).error

		get: (req, res, next) ->
			School.findById(req.params.id).exec(handler(next).error)
			.then (school) ->
				res.send school
