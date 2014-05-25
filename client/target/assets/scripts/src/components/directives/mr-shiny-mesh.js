(function() {
  angular.module('major').directive('mrShinyMesh', function(mrTimer) {
    return {
      restrict: 'E',
      scope: {
        resize: '='
      },
      link: function(scope, elem, attrs) {
        var myMesh, simpleAnimatedFSSMesh;
        simpleAnimatedFSSMesh = function(container, meshOptions, lightOptions, Renderer, maxFPS) {
          this.meshOptions = meshOptions;
          this.lightOptions = lightOptions;
          this.container = container;
          this._renderer = new Renderer;
          this._scene = new FSS.Scene;
          this._light = new FSS.Light(lightOptions.ambient, lightOptions.diffuse);
          this._geometry = null;
          this._material = null;
          this._mesh = null;
          this._now = null;
          this._start = Date.now();
          this._timer = mrTimer(maxFPS);
        };
        simpleAnimatedFSSMesh.prototype.resize = function() {
          return this._renderer.setSize(this.container.width(), this.container.height());
        };
        simpleAnimatedFSSMesh.prototype.animate = function() {
          this._now = Date.now() - this._start;
          this.update();
          this._light.setPosition(300 * Math.sin(this._now * 0.001), 200 * Math.cos(this._now * 0.0005), 60);
          return this._renderer.render(this._scene);
        };
        simpleAnimatedFSSMesh.prototype.update = function() {
          var MESH, offset, ox, oy, oz, v, vertex;
          MESH = this.meshOptions;
          ox = void 0;
          oy = void 0;
          oz = void 0;
          v = void 0;
          vertex = void 0;
          offset = MESH.depth / 2;
          v = this._geometry.vertices.length - 1;
          while (v >= 0) {
            vertex = this._geometry.vertices[v];
            ox = Math.sin(vertex.time + vertex.step[0] * this._now * MESH.speed);
            oy = Math.cos(vertex.time + vertex.step[1] * this._now * MESH.speed);
            oz = Math.sin(vertex.time + vertex.step[2] * this._now * MESH.speed);
            FSS.Vector3.set(vertex.position, MESH.xRange * this._geometry.segmentWidth * ox, MESH.yRange * this._geometry.sliceHeight * oy, MESH.zRange * offset * oz - offset);
            FSS.Vector3.add(vertex.position, vertex.anchor);
            v--;
          }
          return this._geometry.dirty = true;
        };
        simpleAnimatedFSSMesh.prototype.createMesh = function() {
          var MESH, v, vertex, _results;
          MESH = this.meshOptions;
          this._scene.remove(this._mesh);
          this._renderer.clear();
          this._geometry = new FSS.Plane(MESH.width * this._renderer.width, MESH.height * this._renderer.height, MESH.segments, MESH.slices);
          this._material = new FSS.Material(MESH.ambient, MESH.diffuse);
          this._mesh = new FSS.Mesh(this._geometry, this._material);
          this._scene.add(this._mesh);
          v = void 0;
          vertex = void 0;
          v = this._geometry.vertices.length - 1;
          _results = [];
          while (v >= 0) {
            vertex = this._geometry.vertices[v];
            vertex.anchor = FSS.Vector3.clone(vertex.position);
            vertex.step = FSS.Vector3.create(Math.randomInRange(0.2, 1.0), Math.randomInRange(0.2, 1.0), Math.randomInRange(0.2, 1.0));
            vertex.time = Math.randomInRange(0, Math.PIM2);
            _results.push(v--);
          }
          return _results;
        };
        simpleAnimatedFSSMesh.prototype.initialize = function() {
          this._scene.add(this._light);
          this.container.append(this._renderer.element);
          window.addEventListener('resize', this.resize.bind(this));
          this.createMesh();
          this.resize();
          this._timer.add(this.animate.bind(this));
          return this._timer.start();
        };
        myMesh = new simpleAnimatedFSSMesh(elem, {
          width: 1.5,
          height: 1.5,
          depth: 4,
          segments: 3,
          slices: 3,
          xRange: 0.4,
          yRange: 0.4,
          zRange: 0.3,
          ambient: '#06741C',
          diffuse: '#FFFFFF',
          speed: 0.0005
        }, {
          ambient: '#06741C',
          diffuse: '#289E49'
        }, FSS.SVGRenderer, 30);
        myMesh.initialize();
        return scope.$watchCollection('resize', function() {
          console.log('RESIZE');
          return myMesh.resize();
        });
      }
    };
  });

}).call(this);
