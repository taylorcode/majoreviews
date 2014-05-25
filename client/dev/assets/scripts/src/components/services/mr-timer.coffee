angular.module('major')

.factory 'mrTimer', ->

  requestAnimationFrame = (->
    window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.msRequestAnimationFrame or window.oRequestAnimationFrame or (f) -> window.setTimeout f, 1e3 / 60
  )()

  Timer = (fps) ->
    @fps = fps
    @then = Date.now()
    @now = null
    @go = true
    @callbacks = []
    return

  Timer::add = (cb) ->
    @callbacks.push cb
    return

  Timer::remove = (cb) ->
    index = @callbacks.indexOf(cb)
    @callbacks.splice index, 1  if index isnt -1
    return

  Timer::_invokeCallbacks = ->
    i = 0

    while i < @callbacks.length
      @callbacks[i]()
      i++
    return

  Timer::loop = ->
    return unless @go
    requestAnimationFrame =>
      @loop()
    @now = Date.now()
    delta = @now - @then
    interval = 1000 / @fps
    if delta > interval
      @then = @now - (delta % interval)
      @_invokeCallbacks()

  Timer::start = ->
    @go = true
    @loop()

  Timer::stop = ->
    @go = false

  (fps) ->
    new Timer(fps)
