# register dependencies in the container
clientErrorHandler = (err, req, res, next) ->
  return res.send(err.statusCode, err)  if err.statusCode
  return res.send(400, err)  if err.name is 'ValidationError'
  res.send 500, err
  return
serverDir = './server/target'
clientDir = 'client/target'
express = require 'express'
app = express()
logfmt = require 'logfmt'
mongo = require 'mongodb'
mongoose = require 'mongoose'
bodyParser = require 'body-parser'
dependable = require 'dependable'
container = dependable.container()
routes = require serverDir + '/routes'
dependencies = require serverDir + '/dependencies'

mongoUri = process.env.MONGOLAB_URI or process.env.MONGOHQ_URL or 'mongodb://localhost/majoreviews'
mongoose.connect mongoUri, (err, db) ->
  throw err  if err
  console.log 'Successfully connected to Majoreviews MongoDB.'

app.set 'port', Number(process.env.PORT) or 1234
app.use express.static clientDir
app.use bodyParser()
dependencies container
container.register 'app', ->
  app

routes.setup container
app.use clientErrorHandler

# this MUST come after the routes are set up above (not sure why yet)
app.use (req, res) ->
  res.sendfile clientDir + '/index.html'

app.use logfmt.requestLogger()
app.listen app.get('port'), ->
  console.log 'Listening on ' + app.get 'port'
  return
