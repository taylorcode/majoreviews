(function() {
  module.exports = function(container) {
    return container.resolve(function(_, Account, Review, Request, sendEmail, compileTemplate, formatResponse, handler) {
      var sendManage;
      sendManage = function(email, req, res, next) {
        var accountCheckpoint, getReviewsById, sendManageEmail, submitRequestsForReviews;
        accountCheckpoint = function(account) {
          if (!account) {
            partialSendEmail('You have no reviews on Majorreview.com', 'You have not left a review for a major yet. Start today! <a href="http://localhost:5000/">Majorreviews.com</a>');
            return res.send(formatResponse('no account found to manage reviews for.'));
          }
          return account;
        };
        getReviewsById = function(reviewIds) {
          return Review.find().where('_id')["in"](reviewIds).exec(handler(next).error);
        };
        submitRequestsForReviews = function(email, reviews) {
          var requests;
          requests = _.map(reviews, function(review) {
            return {
              major: review.major,
              email: email,
              updateReview: review._id
            };
          });
          return Request.create(requests).then(function(requests) {
            var idQuery;
            if (!requests.length) {
              requests = [requests];
            }
            idQuery = _.map(requests, function(request) {
              return {
                _id: request._id
              };
            });
            return Request.find().or(idQuery).populate('major').exec(handler(next).error);
          }, handler(next).error);
        };
        sendManageEmail = function(email, requests) {
          return compileTemplate('emails/manage', requests).then(sendEmail.curry(email, 'Manage your reviews on Majoreview.com'));
        };
        return Account.findOne({
          email: email
        }).exec(handler(next).error).then(accountCheckpoint).then(function(account) {
          return account.reviews;
        }).then(getReviewsById).then(submitRequestsForReviews.curry(email)).then(sendManageEmail.curry(email));
      };
      return {
        sendManage: sendManage,
        create: function(req, res, next) {
          var args;
          args = Array.prototype.slice.call(arguments, 0);
          args.unshift(req.body.email);
          return sendManage.apply(this, args).then(function() {
            return res.send(formatResponse('manage my reviews email sent.'));
          });
        }
      };
    });
  };

}).call(this);
