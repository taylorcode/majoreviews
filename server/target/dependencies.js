(function() {
  var _;

  _ = require('underscore');

  module.exports = function(container) {
    var models;
    models = ['Account', 'Major', 'Request', 'Review', 'School'];
    container.register('sendEmail', function() {
      return require('./modules/send-email')('Gmail', 'taylorsmcintyre@gmail.com', 'TMgoogle');
    });
    container.register('eventEmitter', function() {
      var events;
      events = require('events');
      return new events.EventEmitter();
    });
    container.register('compileTemplate', function() {
      return require('./modules/handlebars-loader')('templates');
    });
    container.register('_', function() {
      return require('underscore');
    });
    container.register('formatResponse', function() {
      return require('./plugins/response-formatter.js');
    });
    container.register('RSVP', function() {
      return require('rsvp');
    });
    container.register('handler', function() {
      return require('./modules/handler');
    });
    container.register('error', function() {
      return require('restify-errors');
    });
    container.load('async');
    container.register('options', {
      maxAllowedReviews: 3
    });
    return container.resolve(function(_) {
      return _.each(models, function(model) {
        return container.register(model, function() {
          return require('./models/' + model.toLowerCase());
        });
      });
    });
  };

}).call(this);
