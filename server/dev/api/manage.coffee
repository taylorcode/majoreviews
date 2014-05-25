module.exports = (container) ->

	container.resolve (_, Account, Review, Request, sendEmail, compileTemplate, formatResponse, handler) ->

		# just for inner reference
		sendManage = (email, req, res, next) ->

			# accountCheckpoint
			accountCheckpoint = (account) ->
				if not account
					partialSendEmail 'You have no reviews on Majorreview.com', 'You have not left a review for a major yet. Start today! <a href="http://localhost:5000/">Majorreviews.com</a>'
					return res.send formatResponse 'no account found to manage reviews for.'
				account

			getReviewsById = (reviewIds) ->
				Review.find().where('_id').in(reviewIds).exec handler(next).error

			# take reviews, generate requests, populate requests with data, return requests promise
			submitRequestsForReviews = (email, reviews) ->		
				# create request specs
				requests = _.map reviews, (review) ->
					major: review.major
					email: email
					updateReview: review._id

				Request.create(requests).then ->
					# find requests with ID - convert to array if only one
					idQuery = _.map arguments, (request) ->
						_id: request._id
					Request.find().or(idQuery).populate('major').exec handler(next).error
				, handler(next).error

			# send manage email for the request
			sendManageEmail = (email, requests) ->
				compileTemplate('emails/manage', requests)
				.then(sendEmail.curry email, 'Manage your reviews on Majoreview.com')

			Account.findOne(email: email).exec(handler(next).error)
			.then(accountCheckpoint) # make sure the account is there
			.then (account) ->
				account.reviews
			.then(getReviewsById)
			.then(submitRequestsForReviews.curry email)
			.then(sendManageEmail.curry email)

		sendManage: sendManage

		create: (req, res, next) ->

			args = Array.prototype.slice.call(arguments, 0)
			args.unshift req.body.email



			sendManage.apply(@, args)
			.then ->
				res.send formatResponse 'manage my reviews email sent.'
