(function() {
  var async, checkAdmin, formatResponse, setup;

  checkAdmin = function(req, res, next) {
    if (req.body.adminKey !== 'zXio093m5jKWpby39rkldPW') {
      return next('not admin.');
    }
    return next();
  };

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
      app.post('/api/school', checkAdmin, school.create);
      app.get('/api/school/:id', school.get);
      app.post('/api/major', checkAdmin, major.create);
      app.get('/api/major', major.query);
      app.get('/api/major/:id', major.get);
      app.post('/api/account', checkAdmin, account.create);
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
    args = Array.prototype.slice.call(arguments);
    return function() {
      return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
  };

  Function.prototype.partial = function() {
    var args, fn;
    fn = this;
    args = Array.prototype.slice.call(arguments);
    return function() {
      var arg, i;
      arg = 0;
      i = 0;
      while (i < args.length && arg < arguments.length) {
        if (args[i] === void 0) {
          args[i] = arguments[arg++];
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
