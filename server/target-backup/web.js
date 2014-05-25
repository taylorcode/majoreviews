(function() {
  var app, bodyParser, clientDir, clientErrorHandler, container, dependable, dependencies, express, logfmt, mongo, mongoUri, mongoose, routes, serverDir;

  clientErrorHandler = function(err, req, res, next) {
    if (err.statusCode) {
      return res.send(err.statusCode, err);
    }
    if (err.name === 'ValidationError') {
      return res.send(400, err);
    }
    res.send(500, err);
  };

  serverDir = './server/target';

  clientDir = 'client/target';

  express = require('express');

  app = express();

  logfmt = require('logfmt');

  mongo = require('mongodb');

  mongoose = require('mongoose');

  bodyParser = require('body-parser');

  dependable = require('dependable');

  container = dependable.container();

  routes = require(serverDir + '/routes');

  dependencies = require(serverDir + '/dependencies');

  mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/majoreviews';

  mongoose.connect(mongoUri, function(err, db) {
    if (err) {
      throw err;
    }
    return console.log('Successfully connected to Majoreviews MongoDB.');
  });

  app.set('port', Number(process.env.PORT) || 5000);

  app.use(express["static"](clientDir));

  app.use(bodyParser());

  dependencies(container);

  container.register('app', function() {
    return app;
  });

  routes.setup(container);

  app.use(clientErrorHandler);

  app.use(function(req, res) {
    return res.sendfile(clientDir + '/index.html');
  });

  app.use(logfmt.requestLogger());

  app.listen(app.get('port'), function() {
    console.log('Listening on ' + app.get('port'));
  });

}).call(this);
