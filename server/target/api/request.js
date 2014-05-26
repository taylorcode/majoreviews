(function() {
  module.exports = function(container) {
    return container.resolve(function(_, Request, Account, Major, sendEmail, options, formatResponse, eventEmitter, compileTemplate, handler, error) {
      return {
        create: function(req, res, next) {
          var email, majorId, requestReview, sendRequest;
          email = req.body.email;
          majorId = req.body.major;
          requestReview = function(email, majorId, account) {
            return Major.findByIdOrName(majorId).populate('school').exec(handler(next).noDocError).then(function(major) {
              var requestData;
              if (major.school.emailDomain !== email.split('@')[1]) {
                return next(new error.InvalidArgumentError(major.school.emailDomain));
              }
              requestData = {
                major: major,
                email: email
              };
              if (account) {
                _.each(account.reviews, function(review) {
                  if (review.major.toString() === major._id.toString()) {
                    return requestData.updateReview = review._id;
                  }
                });
                if (!requestData.updateReview && account.reviews.length === options.maxAllowedReviews) {
                  eventEmitter.emit('sendEmail:manage', email, req, res, next);
                  return res.send(formatResponse('manage my reviews link sent instead.'));
                }
              }
              return Request.create(requestData).then(null, handler(next).error);
            });
          };
          sendRequest = function(email, requestId) {
            var partialSendEmail;
            partialSendEmail = sendEmail.curry(email);
            return Request.findById(requestId).populate('major').exec(handler(next).noDocError).then(function(request) {
              partialSendEmail = partialSendEmail.curry('Submit a review for ' + request.major.title + 'on Majoreviews.com');
              return request;
            }).then(compileTemplate.curry('emails/request')).then(function(compiled) {
              return partialSendEmail(compiled);
            });
          };
          return Account.findOne({
            email: email
          }).populate('reviews').exec(handler(next).error).then(requestReview.curry(email, majorId)).then(function(request) {
            return sendRequest(email, request._id);
          }).then(function() {
            return res.send(formatResponse('link request initiated.'));
          });
        },
        get: function(req, res, next) {
          var updateExistingReview;
          updateExistingReview = function(request) {
            return Account.findOne({
              email: request.email
            }).populate('reviews').exec(handler(next).error).then(function(account) {
              if (account) {
                _.each(account.reviews, function(review) {
                  if (review.major.toString() === request.major._id.toString()) {
                    return request.review = review;
                  }
                });
              }
              return request;
            });
          };
          return Request.findById(req.params.id).populate('major').lean().exec(handler(next).noDocError).then(updateExistingReview).then(function(request) {
            return res.send(request);
          });
        }
      };
    });
  };

}).call(this);
