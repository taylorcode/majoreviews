
# TODO - error states with restify, not formatResponse
setup = (container) ->
  
  # register the api in the container
  school = require('./api/school')(container)
  major = require('./api/major')(container)
  account = require('./api/account')(container)
  request = require('./api/request')(container)
  manage = require('./api/manage')(container)
  review = require('./api/review')(container)
  container.resolve (eventEmitter, app) ->
    
    # register events for the api
    eventEmitter.on 'sendEmail:manage', manage.sendManage
    
    # schools
    app.post '/api/school', school.create
    app.get '/api/school/:id', school.get
    
    # major
    app.post '/api/major', major.create
    app.get '/api/major', major.query
    app.get '/api/major/:id', major.get
    
    # account
    app.post '/api/account', account.create
    app.get '/api/account/:id', account.get
    
    # request
    app.post '/api/request', request.create
    app.get '/api/request/:id', request.get
    
    # manage
    app.post '/api/manage', manage.create
    
    # review
    app.post '/api/review/:id', review.create # has request ID - TODO CHANGE THIS
    app.put '/api/review/:id', review.remove
    app.get '/api/review/:id', review.get
    return

  return
  
Function::curry = ->
  fn = this
  args = Array::slice.call arguments
  ->
    fn.apply this, args.concat(Array::slice.call arguments)

Function::partial = ->
  fn = this
  args = Array::slice.call arguments
  ->
    arg = 0
    i = 0
    while i < args.length and arg < arguments.length
      args[i] = arguments[arg++]  if args[i] is undefined
      i++
    fn.apply this, args

formatResponse = require('./plugins/response-formatter.js')
async = require('async')
exports.setup = setup