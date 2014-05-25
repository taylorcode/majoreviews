Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
	  return fn.apply(this, args.concat(
	    Array.prototype.slice.call(arguments)));
	};
};

Function.prototype.partial = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function(){
	  var arg = 0;
	  for ( var i = 0; i < args.length && arg < arguments.length; i++ )
	    if ( args[i] === undefined )
	      args[i] = arguments[arg++];
	  return fn.apply(this, args);
	};
};

var formatResponse = require('./plugins/response-formatter.js');

var nodemailer = require('nodemailer');
// TODO - error states with restify, not formatResponse
var async = require('async');

var School = require('./models/school'),
	Major = require('./models/major'),
	Review = require('./models/review'),
	Account = require('./models/account'),
	Request = require('./models/request'),
	Review = require('./models/review');

var MAIL_EMAIL = 'taylorsmcintyre@gmail.com';
var MAIL_PASSWORD = 'TMgoogle';
var MAX_ALLOWED_REVIEWS = 3;

function sendEmail (to, subject, html) {

	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = nodemailer.createTransport('SMTP', {
	    service: 'Gmail',
	    auth: {
	        user: MAIL_EMAIL,
	        pass: MAIL_PASSWORD
	    }
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Majoreviews.com ✔ <'+MAIL_EMAIL+'>', // sender address
	    //to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
	    to: to,
	    subject: subject, // Subject line
	    // text: "Hello world ✔", // plaintext body
	    html: html
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if(error) return next(err);
	    // if you don't want to use this transport object anymore, close
	    smtpTransport.close(); // shut down the connection pool, no more messages
	});

}


/* all of the following functions until setup are for the /manage route*/
function findAccountByEmail (email, callback) {
	Account.findOne({email: email}).exec(function (err, account) {
		if(err) return next(err);
		callback(null, account);
	});
}

function getReviewsById (reviewIds, callback) {
	Review.find().where('_id').in(reviewIds).exec(function (err, reviews) {
		if(err) return next(err);
		callback(null, reviews);
	});
}

function submitRequestsForReview (email, reviews, callback) {
	// iterate through reviews, create new requests for them
	async.map(reviews, function (review, callback) {
		var reviewData = {
			major: review.major, 
			email: email, 
			updateReview: review._id
		}
		var request = new Request(reviewData);
		request.save(function (err, request) {
			if(err) return next(err);
			// immediately find and populate with major
			Request.findOne(request).populate('major').exec(function (err, request) {
				if(err) return next(err);
				callback(null, request);
			});
		});
	}, callback);
}

function createLinkForRequest (request) {
	return '<div><span>'+request.major.title+'</span><a href="http://localhost:5000/review/'+request._id+'">Review This Major</a></div>'
}

function sendManageEmail (email, requests, callback) {
	// create links for requests
	var links = '';
	for(var i=0; i<requests.length; i++) {
		links += createLinkForRequest(requests[i]);
	}
	sendEmail(email, 'Manage your existing reviews', links);
	callback()
}

function setup (app) {

	// school
	app.post('/api/school', function (req, res, next) {
		var school = new School(req.body);
		school.save(function (err, school) {
			if (err) return next(err);
			res.send(school);
		});
	});

	app.get('/api/school/:id', function (req, res, next) {
		School.findById(req.params.id, function (err, school) {
			if (err) return next(err);
			res.send(school);
		})
	});


	// major
	app.post('/api/major', function (req, res, next) {
		var major = new Major(req.body);

		// make sure that it is a valid school
		School.findById(major.school, function (err, school) {
			if(err) return next(err);
			if(!school) return next(formatResponse('Not a valid school.'));
			// everthing OK, save the major and store reference on school
			saveMajor(major, school._id);
		});

		function saveMajor (major, schoolId) {
			major.save(function (err, major) {
				if(err) return next(err);
				School.update({
					_id: schoolId
				}, {
					$addToSet: {
						majors: major._id
					}
				}, function (err, updated) {
					if(err) return next(err);
					if(!updated) return res.send(formatResponse('Failed to add major to school.'));
					res.send(major);
				});
			});
		}
	});

	app.get('/api/major', function (req, res, next) {


		function matchAvgsToMajors (majors, avgs, callback) {
			for(var i=0; i<majors.length; i++) for(var q=0; q<avgs.length; q++) {
				if(majors[i]._id.toString() === avgs[q]._id.toString()) {
					majors[i].rating = {
						overall: avgs[q].overall
					}
				}
			}
			return majors;
		}

		// find the overall average score for each major
		function avgOveralls (callback) {
			Review.aggregate([
				{ $group: {
					_id: '$major',
					overall: {
						$avg: '$overall'
					}
				}}

			], function (err, avgs) {
				if(err) return next(err);
				callback(null, avgs);
			});
		}

		// get all majors
		function getMajorsLean (callback) {
			Major.find({}).lean().exec(function (err, majors) {
				if (err) return next(err);
				callback(null, majors)
			});
		}

		async.parallel([
			getMajorsLean,
			avgOveralls
		], function (err, results) {
			if(err) return next(err);
			// results[0] is the majors,
			// results[1] are the aggregated and averaged scores
			var matched = matchAvgsToMajors(results[0], results[1]);
			res.send(matched);
		});

	});

	app.get('/api/major/:id', function (req, res, next) {

		var majorId = req.params.id,
			groupByQuery = {
				_id: majorId,
				overall: {
					$avg: '$overall'
				}
			};

		// build groupBy query to include all of the metrics (so they can be changed whenever and this updates)
		for(var path in Review.schema.paths) {
			var metric = path.split('metrics.')[1];
			if(metric) {
				groupByQuery[metric] = {
					$avg: '$' + path
				}
			}
		}

		function averageScores (majorId, groupQuery, callback) {
			// aggregate reviews for just this one major
			Review.aggregate([
				{ $group: groupQuery }
			], function (err, avgs) {
				if(err) return next(err);
				callback(null, avgs);
			});
		}

		function getMajorLean (majorId, callback) {
			Major.findByIdOrName(majorId)
			.populate('school').populate('reviews').lean().exec(function (err, major) {
				if (err) return next(err);
				callback(null, major);
			});
		}

		async.parallel([
			getMajorLean.curry(majorId),
			averageScores.curry(majorId, groupByQuery)
		], function (err, results) {
			var avgs, major;
			if(err) return next(err);
			major = results[0];
			avgs = results[1][0];
			// results[0] is the major and results[1] are the averages
			// merge the ratings onto the major
			major.rating = {
				overall: avgs.overall
			};
			delete avgs.overall;
			delete avgs._id;
			major.rating.metrics = avgs;
			res.send(major);
		})

	});

	// account
	app.post('/api/account', function (req, res, next) {

		var account = new Account(req.body);

		account.save(function (err, account) {
			if(err) return next(err);
			res.send(account);
		});

	});

	app.get('/api/account/:id', function (req, res, next) {

		Account.findById(req.params.id).populate('reviews').exec(function (err, account) {
			if(err) return next(err);
			res.send(account);
		});
		
	});

	// request to review
	app.post('/api/request', function (req, res, next) {

		var email = req.body.email,
			majorId = req.body.major;


		Account.findOne({email: email}).populate('reviews').exec(function (err, account) {
			if(err) return next(err);
			requestReview(email, majorId, account);
		});


		function requestReview(email, majorId, account) {
			// confirm that the domain of this email is the domain of the major's school
			Major.findByIdOrName(majorId).populate('school').exec(function (err, major) {
				var request, reviewData;
				if(err) return next(err);
				if(!major) return res.send(formatResponse('no matching major found.'));

				// they don't match
				if(major.school.emailDomain !== email.split('@')[1]) return res.send(formatResponse('email domain incorrect.'));

				reviewData = {major: major._id, email: email};
 
				if(account) {
					// look through the reviews, if they have reviewed the major, then add the reviewId to the request
					for(var i=0; i<account.reviews.length; i++) {
						if(account.reviews[i].major.toString() === major._id.toString()) {
							reviewData.updateReview = account.reviews[i]._id;
						}
					}
					// if they are not updating a review, and they've already submitted the MAX_ALLOWED_REVIEWS
					// send them the "Manage my reviews" email
					// don't create a request, just send them the manage my reviews email
					if(!reviewData.updateReview && account.reviews.length === MAX_ALLOWED_REVIEWS) {
						async.waterfall([
							submitRequestsForReview.curry(email, account.reviews),
							sendManageEmail.curry(email)
						], function (err, requests) {
							if(err) return next(err);
							res.send(formatResponse('manage my reviews sent instead of edit review.'));
						});
						return;
					}
				}

				request = new Request(reviewData);

				request.save(function (err, request) {
					if(err) return next(err);
					sendRequest(request._id);
				});

			});
		}

		// find the request, populate with major, send the request email
		function sendRequest (requestId) {

			Request.findById(requestId).populate('major').exec(function (err, request) {
				if(err) return next(err);
				if(!request) return res.send(formatResponse('no maching request found.'));

				res.send(formatResponse('link request initiated.'));

				sendEmail(request.email, 'Request to Review ' + request.major.title, '<h1>Click the link below to leave a review for '+request.major.title+'</h1><a href="http://localhost:5000/review/'+request._id+'">Review This Major</a>');

			});

		}

	});

	app.get('/api/request/:id', function (req, res, next) {

		// determine if this is a revision by seeing if the email is an existing account
		// and the major is already reviewed this account
		// find that review, and attach it to the request, then send the request
		Request.findById(req.params.id).populate('major').lean().exec(function (err, request) {
			if (err) return next(err);
			if (!request) return res.send(formatResponse('request id not valid.'));
			Account.findOne({email: request.email}).populate('reviews').exec(function (err, account) {
				if(err) return next(err);
				if(account) {
					// look through the reviews, if they have reviewed the major, then attach the review data to the request
					for(var i=0; i<account.reviews.length; i++) {

						if(account.reviews[i].major.toString() === request.major._id.toString()) {
							request.review = account.reviews[i];
						}
					}
				}
				return res.send(request);
			});
		});
	});

	// request to manage reviews
	app.post('/api/manage', function (req, res, next) {
		var email = req.body.email;

		var partialSubmitRequestForReview = submitRequestsForReview.curry(email),
			partialSendManageEmail = sendManageEmail.curry(email);

		async.waterfall([
			findAccountByEmail.curry(email),
			function (account, callback) {
				if(!account) {
					sendEmail(email, 'You have no reviews on Majorreview.com', 'You have not left a review for a major yet. Start today! <a href="http://localhost:5000/">Majorreviews.com</a>');
					return res.send(formatResponse('No account found to manage reviews for.'));
				}
				callback(null, account.reviews);
			},
			getReviewsById,
			partialSubmitRequestForReview,
			partialSendManageEmail
		], function (err, requests) {
			if(err) return next(err);
			res.send(formatResponse('manage my reviews sent.'));
		});
	});

	// review
	app.post('/api/review/:id', function (req, res, next) {

		var partialMergeRequestReview = mergeRequestReview.curry(req.params.id, req.body.review);

		var partialAccountAssociateReview,
			partialMajorAssociateReview,
			partialSendReview;

		function mergeRequestReview (requestId, review, callback) {
			var reviewId = review._id;

			Request.findById(requestId, function (err, request) {

				if(err) return next(err);
				if(!request) return next('invalid request.');

				var majorId = request.major,
					newReview;

				review.time = new Date();

				if(request.updateReview) {
					if(review._id.toString() === request.updateReview.toString()) {
						// prevent tampering with these values - override would persist tampering to the data
						delete review._id
						delete review.__v;

						Review.update({_id: reviewId}, review, function (err, updated) {
							if(err) return next(err);
							removeRequest(requestId, function () {
								res.send(formatResponse('review updated.'));
							});
						});

					} else {
						return next('You sneaky motherfucker. The reviewId must match the reviewId of the request. Please stop trying to hack my site.');
					}

				} else {
					review.major = majorId;

					newReview = new Review(review);

					newReview.save(function (err, review) {
						if(err) return next(err);
						callback(null, request, review);
					});
				}
			});
		}

		function findCreateAccount (email, callback) {

			Account.findOne({email: email}, function (err, account) {
				var newAccount;
				if(err) return next(err);

				if(account) return callback(null, account);
				// make the account
				newAccount = new Account({email: email});

				newAccount.save(function (err, account) {
					if(err) return next(err);
					callback(null, account);
				});

			});
		}

		function removeRequest (requestId, callback) {
			Request.remove({_id: requestId}, function (err) {
				if(err) return next(err);
				callback();
			});
		}


		function accountAssociateReview (review, accountId, callback) {

			Account.update({
				_id: accountId
			}, {
				$addToSet: {
					reviews: review._id
				}
			}, function (err, updated) {
				if(err) return next(err);
				if(!updated) return res.send(formatResponse('Failed to add review to account.'));
				callback();
			});
		}

		function majorAssociateReview (review, callback) {

			Major.update({
				_id: review.major
			}, {
				$addToSet: {
					reviews: review._id
				}
			}, function (err, updated) {
				if(err) return next(err);
				if(!updated) return res.send(formatResponse('Failed to add review to major.'));
				callback();
			});
		}

		function sendReview (review) {
			res.send(review);
		}

		async.waterfall([
			function (callback) {
				partialMergeRequestReview(callback);
			},
			function preload (request, review, callback) {
				// preload these functions with the review to prevent having to pass through as an argument
				partialAccountAssociateReview = accountAssociateReview.curry(review);
				partialMajorAssociateReview = majorAssociateReview.curry(review);
				partialSendReview = sendReview.curry(review);
				partialRemoveRequest = removeRequest.curry(request._id);
				partialFindCreateAccount = findCreateAccount.curry(request.email);
				callback(null, request);
			},

			function removeRequestCreateAccount (request, callback) {

				async.parallel([
					partialRemoveRequest,
					partialFindCreateAccount
				], function (err, results) {
					callback(null, results[1]);
				});

			},

			function associateReview (account, callback) {

				async.parallel([
					// associate the account with the review
					function (innerCb) {
						partialAccountAssociateReview(account._id, innerCb);
					},
					// associate the major with the review
					partialMajorAssociateReview

				], callback);
			}
		], function () {
			partialSendReview();
		});

	});

	app.get('/api/review/:id', function (req, res, next) {

		Review.findById(req.params.id).exec(function (err, review) {
			if(err) return next(err);
			res.send(review);
		});
		
	});

	// app.get('/api/search/:search', function (req, res, next) {
		
	// 	Major.findOne({title: new RegExp(req.params.search, 'i')}, function (err, majors) {

	// 	});

	// });

}
 
exports.setup = setup;