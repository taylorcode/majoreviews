module.exports = (container) ->

	container.resolve (Account, handler) ->

		create: (req, res, next) ->
			# this needs an error handler
			Account.create(req.body).then (account) ->
				res.send account
			, handler(next).error

		get: (req, res, next) ->
			Account.findById(req.params.id).populate('reviews').exec(handler(next).error)
			.then (account) ->
				res.send account
