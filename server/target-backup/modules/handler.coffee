handler = (next) ->
	error: (err) ->
		return next err if err
	noDocError: (err, docs) ->
		return next err if err
		return next 'no documents found.' if not docs

module.exports = handler