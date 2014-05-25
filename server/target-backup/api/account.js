(function() {
  module.exports = function(container) {
    return container.resolve(function(Account, handler) {
      return {
        create: function(req, res, next) {
          return Account.create(req.body).then(function(account) {
            return res.send(account);
          }, handler(next).error);
        },
        get: function(req, res, next) {
          return Account.findById(req.params.id).populate('reviews').exec(handler(next).error).then(function(account) {
            return res.send(account);
          });
        }
      };
    });
  };

}).call(this);
