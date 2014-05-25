(function() {
  module.exports = function(container) {
    return container.resolve(function(School, handler) {
      return {
        create: function(req, res, next) {
          return School.create(req.body).then(function(school) {
            return res.send(school);
          }, handler(next).error);
        },
        get: function(req, res, next) {
          return School.findById(req.params.id).exec(handler(next).error).then(function(school) {
            return res.send(school);
          });
        }
      };
    });
  };

}).call(this);
