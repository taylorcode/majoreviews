angular.module('major')

.factory 'mediaQueries', ->

	Mq = (resolutions) ->
		(scope) ->
			$w = $(window)
			$w.on 'resize orientationchange', ->
				width = $w.width()
				sizes = {}

				_.each resolutions, (res, media) ->
					sizes[media] = false
					sizes[media] = true if (res.length is 1 and width >= res[0]) or (res.length is 2 and width >= res[0] and width <= res[1])

				scope.$apply ->
					scope.media = {} if not scope.media
					scope.media.width = $w.width()
					scope.media.sizes = sizes

			.trigger 'resize'

	(resolutions) ->
		monitor = Mq resolutions

