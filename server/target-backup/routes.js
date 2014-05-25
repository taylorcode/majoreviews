(function() {
  var async, formatResponse, setup;

  setup = function(container) {
    var account, major, manage, request, review, school;
    school = require('./api/school')(container);
    major = require('./api/major')(container);
    account = require('./api/account')(container);
    request = require('./api/request')(container);
    manage = require('./api/manage')(container);
    review = require('./api/review')(container);
    container.resolve(function(eventEmitter, app) {
      eventEmitter.on('sendEmail:manage', manage.sendManage);
      app.post('/api/school', school.create);
      app.get('/api/school/:id', school.get);
      app.post('/api/major', major.create);
      app.get('/api/major', major.query);
      app.get('/api/major/:id', major.get);
      app.post('/api/account', account.create);
      app.get('/api/account/:id', account.get);
      app.post('/api/request', request.create);
      app.get('/api/request/:id', request.get);
      app.post('/api/manage', manage.create);
      app.post('/api/review/:id', review.create);
      app.put('/api/review/:id', review.remove);
      app.get('/api/review/:id', review.get);
    });
  };

  Function.prototype.curry = function() {
    var args, fn;
    fn = this;
    args = Array.prototype.slice.call(arguments_);
    return function() {
      return fn.apply(this, args.concat(Array.prototype.slice.call(arguments_)));
    };
  };

  Function.prototype.partial = function() {
    var args, fn;
    fn = this;
    args = Array.prototype.slice.call(arguments_);
    return function() {
      var arg, i;
      arg = 0;
      i = 0;
      while (i < args.length && arg < arguments_.length) {
        if (args[i] === undefined) {
          args[i] = arguments_[arg++];
        }
        i++;
      }
      return fn.apply(this, args);
    };
  };

  formatResponse = require('./plugins/response-formatter.js');

  async = require('async');

  exports.setup = setup;

}).call(this);
