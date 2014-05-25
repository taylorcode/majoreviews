(function() {
  var handler;

  handler = function(next) {
    return {
      error: function(err) {
        if (err) {
          return next(err);
        }
      },
      noDocError: function(err, docs) {
        if (err) {
          return next(err);
        }
        if (!docs) {
          return next('no documents found.');
        }
      }
    };
  };

  module.exports = handler;

}).call(this);
