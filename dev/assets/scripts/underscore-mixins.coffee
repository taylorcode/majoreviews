_.mixin
    strip: (obj, props) ->
    	_.each props, (prop) ->
    		delete obj[prop]
    	obj