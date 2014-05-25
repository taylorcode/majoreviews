angular.module('major')
.directive 'mrShinyMesh', (mrTimer) ->
	restrict: 'E'
	scope:
		resize: '=' 
	link: (scope, elem, attrs) ->
		# update time stuffs
		simpleAnimatedFSSMesh = (container, meshOptions, lightOptions, Renderer, maxFPS) ->
		  @meshOptions = meshOptions
		  @lightOptions = lightOptions
		  @container = container
		  @_renderer = new Renderer
		  @_scene = new FSS.Scene
		  @_light = new FSS.Light(lightOptions.ambient, lightOptions.diffuse)
		  @_geometry = null
		  @_material = null
		  @_mesh = null
		  @_now = null
		  @_start = Date.now()
		  @_timer = mrTimer(maxFPS)
		  return

		simpleAnimatedFSSMesh::resize = ->
		  @_renderer.setSize @container.width(), @container.height()

		simpleAnimatedFSSMesh::animate = ->
		  @_now = Date.now() - @_start
		  @update()
		  @_light.setPosition 300 * Math.sin(@_now * 0.001), 200 * Math.cos(@_now * 0.0005), 60
		  @_renderer.render @_scene

		simpleAnimatedFSSMesh::update = ->
		  MESH = @meshOptions
		  ox = undefined
		  oy = undefined
		  oz = undefined
		  v = undefined
		  vertex = undefined
		  offset = MESH.depth / 2
		  
		  # Animate Vertices
		  v = @_geometry.vertices.length - 1
		  while v >= 0
		    vertex = @_geometry.vertices[v]
		    ox = Math.sin(vertex.time + vertex.step[0] * @_now * MESH.speed)
		    oy = Math.cos(vertex.time + vertex.step[1] * @_now * MESH.speed)
		    oz = Math.sin(vertex.time + vertex.step[2] * @_now * MESH.speed)
		    FSS.Vector3.set vertex.position, MESH.xRange * @_geometry.segmentWidth * ox, MESH.yRange * @_geometry.sliceHeight * oy, MESH.zRange * offset * oz - offset
		    FSS.Vector3.add vertex.position, vertex.anchor
		    v--
		  
		  # Set the Geometry to dirty
		  @_geometry.dirty = true

		simpleAnimatedFSSMesh::createMesh = ->
		  MESH = @meshOptions
		  @_scene.remove @_mesh
		  @_renderer.clear()
		  @_geometry = new FSS.Plane(MESH.width * @_renderer.width, MESH.height * @_renderer.height, MESH.segments, MESH.slices)
		  @_material = new FSS.Material(MESH.ambient, MESH.diffuse)
		  @_mesh = new FSS.Mesh(@_geometry, @_material)
		  @_scene.add @_mesh
		  
		  # Augment vertices for animation
		  v = undefined
		  vertex = undefined
		  v = @_geometry.vertices.length - 1
		  while v >= 0
		    vertex = @_geometry.vertices[v]
		    vertex.anchor = FSS.Vector3.clone(vertex.position)
		    vertex.step = FSS.Vector3.create(Math.randomInRange(0.2, 1.0), Math.randomInRange(0.2, 1.0), Math.randomInRange(0.2, 1.0))
		    vertex.time = Math.randomInRange(0, Math.PIM2)
		    v--

		simpleAnimatedFSSMesh::initialize = ->
		  @_scene.add @_light
		  @container.append @_renderer.element
		  window.addEventListener 'resize', @resize.bind @
		  @createMesh()
		  @resize()
		  @_timer.add @animate.bind @
		  @_timer.start()

		myMesh = new simpleAnimatedFSSMesh elem,
		  width: 1.5
		  height: 1.5
		  depth: 4
		  segments: 3
		  slices: 3
		  xRange: 0.4
		  yRange: 0.4
		  zRange: 0.3
		  ambient: '#06741C'
		  diffuse: '#FFFFFF'
		  speed: 0.0005
		,
		  ambient: '#06741C'
		  diffuse: '#289E49'
		, FSS.SVGRenderer, 30

		myMesh.initialize()
		
		scope.$watchCollection 'resize', ->
			console.log 'RESIZE'
			myMesh.resize()



