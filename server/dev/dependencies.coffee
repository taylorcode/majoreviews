_ = require('underscore')
module.exports = (container) ->
  models = [
    'Account'
    'Major'
    'Request'
    'Review'
    'School'
  ]
  
  # register modules as dependencies
  container.register 'sendEmail', ->
    require('./modules/send-email') 'Gmail', 'taylorsmcintyre@gmail.com', 'TMgoogle'

  container.register 'eventEmitter', ->
    events = require('events')
    new events.EventEmitter()

  container.register 'compileTemplate', ->
    require('./modules/handlebars-loader') 'templates'

  container.register '_', ->
    require 'underscore'

  container.register 'formatResponse', ->
    require './plugins/response-formatter.js'

  container.register 'RSVP', ->
    require 'rsvp'

  container.register 'handler', ->
    require './modules/handler'

  container.load 'async'
  
  # register options as dependency
  container.register 'options',
    maxAllowedReviews: 3

  # register models as dependencies
  container.resolve (_) ->
    _.each models, (model) ->
      
      container.register model, ->
        require './models/' + model.toLowerCase()
