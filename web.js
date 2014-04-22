var express = require('express'),
    app = express(),
    logfmt = require('logfmt'),
    mongo = require('mongodb');
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    handler = require('restify-errors'),
    routes = require('./server/routes');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/majoreviews';

mongoose.connect(mongoUri, function (err, db) {
    if(err) throw err;
    console.log('Successfully connected to Majoreviews MongoDB.');
});

app.set('port', Number(process.env.PORT) || 5000);
app.use(express.static('target'));
// app.use(express.cookieParser());
app.use(bodyParser());
// app.use(express.session({ secret: 'keyboard cats' }));
//app.use(app.router); - deprecated
app.use(clientErrorHandler);
routes.setup(app);
app.use(logfmt.requestLogger());

function clientErrorHandler(err, req, res, next) {
  if(err.statusCode) return res.send(err.statusCode, err);
  if(err.name === 'ValidationError') return res.send(400, err);
  // TODO catch any other errors that we might want to format.
  res.send(new handler.InternalError('Something went wrong.'));
}


app.use(function(req, res) {
    res.sendfile('target/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Listening on ' + app.get('port'));
});
