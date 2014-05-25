module.exports = (container) ->
	container.resolve (Account, Major, Request, Review, RSVP, handler) ->
		create: (req, res, next) ->

			sendResp = (review) ->
				res.send review

			# promise of the account or of a new account if none exists
			findCreateAccount = (email) ->
				Account.findOne(email: email).exec(handler(next).error)
				.then (account) ->
					return account if account
					Account.create(email: email).then null, handler(next).error

			removeRequest = (requestId) ->
				# todo does this return a promise
				Request.findByIdAndRemove(requestId).exec handler(next).error

			# associates a review with an account
			associateReviewWithAccount = (reviewId, accountId) ->
				q = Account.findByIdAndUpdate(accountId,
					$addToSet:
						reviews: reviewId).exec handler(next).error

			associateReviewWithMajor = (reviewId, majorId) ->
				Major.findByIdAndUpdate(majorId,
					$addToSet:
						reviews: reviewId).exec handler(next).error

			# will create a review if there is no updateReview, will update if there is
			createUpdateReview = (requestId, review, createReview, updateReview) ->
				Request.findById(requestId).exec(handler(next).noDocError)
				.then (request) ->
					review.time = new Date
					# updating an existing review
					if request.updateReview
						return next 'you sneaky motherfucker' if review._id.toString() isnt request.updateReview.toString()
						delete review._id
						delete review.__v
						return updateReview.resolve Review.findByIdAndUpdate(review._id, review).exec handler(next).error

					review.major = request.major
					createReview.resolve Review.create(review).then null, handler(next).error


			requestId = req.params.id
			review = req.body.review
			partialAssociateReviewWithAccount = null
			partialAssociateReviewWithMajor = null
			partialSendResp = null
			partialRemoveRequest = removeRequest.curry requestId

			createReview = RSVP.defer()
			updateReview = RSVP.defer()

			# will resolve either createReview or updateReview
			createUpdateReview(requestId, review, createReview, updateReview)

			# creating a new review
			createReview.promise
			.then (review) ->
				partialSendResp = sendResp.curry review
				partialAssociateReviewWithAccount = associateReviewWithAccount.curry review._id
				partialAssociateReviewWithMajor = associateReviewWithMajor.curry review._id, review.major
			.then(findCreateAccount.curry req.body.email)
			.then (account) ->
				RSVP.all [partialRemoveRequest(), partialAssociateReviewWithAccount account._id, partialAssociateReviewWithMajor()]
			.then ->
				partialSendResp()

			# updating an existing review
			updateReview.promise
			.then (review) ->
				partialRemoveRequest()
				sendResp review

		get: (req, res, next) ->
			Review.findById(req.params.id).exec(handler(next).error)
			.then (review) ->
				res.send review

		remove: (req, res, next) ->
			Request.findById(req.body.requestId).exec(handler(next).noDocError)
			.then ->
				Review.findByIdAndRemove(req.params.id).exec(handler(next).error)
			.then (review) ->
				res.send review
