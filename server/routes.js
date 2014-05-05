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
		Major.find({}).exec(function (err, majors) {
			if (err) return next(err);
			res.send(majors);
		});
	});

	app.get('/api/major/:id', function (req, res, next) {

		Major.findByIdOrName(req.params.id)

		.populate('school').populate('reviews').exec(function (err, major) {
			if (err) return next(err);
			res.send(major);
		});

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

				// if there is an account, check if they have reviewed this major, if so, 
				if(account) {
					// look through the reviews, if they have reviewed the major, then add the reviewId to the request
					for(var i=0; i<account.reviews.length; i++) {
						if(account.reviews[i].major.toString() === major._id.toString()) {
							reviewData.updateReview = account.reviews[i]._id;
						}
					}
				}

				request = new Request(reviewData);

				request.save(function (err, request) {
					if(err) return next(err);
					sendEmail(request._id);
				});

			});
		}


		function sendEmail (requestId) {

			Request.findById(requestId).populate('major').exec(function (err, request) {
				if(err) return next(err);
				if(!request) return res.send(formatResponse('no maching request found.'));


				res.send(formatResponse('link request initiated.'));

				var toEmail = request.email;

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
				    to: toEmail,
				    subject: "Hello "+toEmail+" ✔", // Subject line
				    text: "Hello world ✔", // plaintext body
				    html: '<h1>Click the link below to leave a review for '+request.major.title+'</h1><a href="http://localhost:5000/review/'+request._id+'">Review This Major</a>' // html body
				}

				// send mail with defined transport object
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if(error) return next(err);
				    console.log("Message sent: " + response.message);
				    // if you don't want to use this transport object anymore, uncomment following line
				    smtpTransport.close(); // shut down the connection pool, no more messages
				});

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
								res.send(updated);
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