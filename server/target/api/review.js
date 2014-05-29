(function() {
  module.exports = function(container) {
    return container.resolve(function(Account, Major, Request, Review, RSVP, handler) {
      return {
        create: function(req, res, next) {
          var associateReviewWithAccount, associateReviewWithMajor, createReview, createUpdateReview, findCreateAccount, partialAssociateReviewWithAccount, partialAssociateReviewWithMajor, partialRemoveRequest, partialSendResp, removeRequest, requestId, review, sendResp, updateReview;
          sendResp = function(review) {
            return res.send(review);
          };
          findCreateAccount = function(email) {
            return Account.findOne({
              email: email
            }).exec(handler(next).error).then(function(account) {
              if (account) {
                return account;
              }
              return Account.create({
                email: email
              }).then(null, handler(next).error);
            });
          };
          removeRequest = function(requestId) {
            return Request.findByIdAndRemove(requestId).exec(handler(next).error);
          };
          associateReviewWithAccount = function(reviewId, accountId) {
            var q;
            return q = Account.findByIdAndUpdate(accountId, {
              $addToSet: {
                reviews: reviewId
              }
            }).exec(handler(next).error);
          };
          associateReviewWithMajor = function(reviewId, majorId) {
            return Major.findByIdAndUpdate(majorId, {
              $addToSet: {
                reviews: reviewId
              }
            }).exec(handler(next).error);
          };
          createUpdateReview = function(requestId, review, createReview, updateReview) {
            return Request.findById(requestId).exec(handler(next).noDocError).then(function(request) {
              var reviewId;
              review.time = new Date;
              reviewId = review._id;
              if (request.updateReview) {
                if (reviewId.toString() !== request.updateReview.toString()) {
                  return next('you sneaky motherfucker');
                }
                delete review._id;
                delete review.__v;
                return updateReview.resolve(Review.findByIdAndUpdate(reviewId, review).exec(handler(next).error));
              }
              review.major = request.major;
              return createReview.resolve(Review.create(review).then(null, handler(next).error));
            });
          };
          requestId = req.params.id;
          review = req.body.review;
          partialAssociateReviewWithAccount = null;
          partialAssociateReviewWithMajor = null;
          partialSendResp = null;
          partialRemoveRequest = removeRequest.curry(requestId);
          createReview = RSVP.defer();
          updateReview = RSVP.defer();
          createUpdateReview(requestId, review, createReview, updateReview);
          createReview.promise.then(function(review) {
            partialSendResp = sendResp.curry(review);
            partialAssociateReviewWithAccount = associateReviewWithAccount.curry(review._id);
            return partialAssociateReviewWithMajor = associateReviewWithMajor.curry(review._id, review.major);
          }).then(findCreateAccount.curry(req.body.email)).then(function(account) {
            return RSVP.all([partialRemoveRequest(), partialAssociateReviewWithAccount(account._id, partialAssociateReviewWithMajor())]);
          }).then(function() {
            return partialSendResp();
          });
          return updateReview.promise.then(function(review) {
            partialRemoveRequest();
            return sendResp(review);
          });
        },
        get: function(req, res, next) {
          return Review.findById(req.params.id).exec(handler(next).error).then(function(review) {
            return res.send(review);
          });
        },
        remove: function(req, res, next) {
          var reviewId;
          reviewId = req.params.id;
          return Request.findById(req.body.requestId).exec(handler(next).noDocError).then(function(request) {
            if (reviewId.toString() !== request.updateReview.toString()) {
              return next('you sneaky motherfucker');
            }
            return Review.findByIdAndRemove(reviewId).exec(handler(next).error);
          }).then(function(review) {
            return res.send(review);
          });
        }
      };
    });
  };

}).call(this);
