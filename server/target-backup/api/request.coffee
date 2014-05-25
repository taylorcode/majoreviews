module.exports = (container) ->
	container.resolve (_, Request, Account, Major, sendEmail, options, formatResponse, eventEmitter, compileTemplate, handler) ->

		create: (req, res, next) ->

			email = req.body.email
			majorId = req.body.major

			# takes the email, majorId, and account... what is this?
			requestReview = (email, majorId, account) ->

				Major.findByIdOrName(majorId).populate('school').exec(handler(next).noDocError)
				.then (major) ->
					# return error if the emailDomain doesn't match 
					# todo add error state
					return next 'email domain incorrect.' if major.school.emailDomain isnt email.split('@')[1]
					requestData =
						major: major
						email: email

					if account
						# see if they have already reviewed this major, if so, attach updateReview
						_.each account.reviews, (review) ->
							requestData.updateReview = review._id if review.major.toString() is major._id.toString()

						# if they haven't, and they've already submitted the max allowed, send the manage email
						if not requestData.updateReview and account.reviews.length is options.maxAllowedReviews
							# this is untested 
							eventEmitter.emit 'sendEmail:manage', email, req, res, next
							return

					Request.create(requestData).then null, handler(next).error

			sendRequest = (email, requestId) ->

				partialSendEmail = sendEmail.curry email

				Request.findById(requestId).populate('major').exec(handler(next).noDocError)
				.then (request) ->
					partialSendEmail = partialSendEmail.curry 'Submit a review for ' + request.major.title + 'on Majoreviews.com'
					request
				.then(compileTemplate.curry 'emails/request')
				.then (compiled) ->
					partialSendEmail compiled

			Account.findOne(email: email).populate('reviews').exec(handler(next).error)
			.then(requestReview.curry(email, majorId))
			.then (request) ->
				sendRequest email, request._id
			.then ->
				res.send formatResponse 'link request initiated.'

		get: (req, res, next) ->
			updateExistingReview = (request) ->
				Account.findOne(email: request.email).populate('reviews').exec(handler(next).error)
				.then (account) ->
					if account
						_.each account.reviews, (review) ->
							# major is an ID because it is not populated
							request.review = review if review.major.toString() is request.major._id.toString()
					request

			Request.findById(req.params.id).populate('major').lean().exec(handler(next).noDocError)
			.then(updateExistingReview) # if this is updating an existing review, attach the review to the request
			.then (request) ->
				res.send request
		

