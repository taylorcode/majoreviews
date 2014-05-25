(function() {
  var Handlebars, RSVP, fs;

  fs = require('fs');

  Handlebars = require('handlebars');

  RSVP = require('rsvp');

  module.exports = function(directory) {
    return function(path, context, callback) {
      return new RSVP.Promise(function(resolve, reject) {
        return fs.readFile(__dirname + '/../' + directory + '/' + path + '.html', 'utf8', function(err, html) {
          if (err) {
            reject(err);
          }
          return resolve(Handlebars.compile(html)(context));
        });
      });
    };
  };

}).call(this);
