module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      default:
        expand: true
        cwd: 'dev/assets'
        src: ['**/*.coffee']
        dest: 'target/assets'
        ext: '.js'

    compass:
      default:
        options:
          sassDir: 'dev/assets/stylesheets'
          cssDir: 'target/assets/stylesheets'

    htmlbuild:
      default:
        src: 'dev/index.html'
        dest: 'target/'
        options:
          beautify: true
          
          #prefix: '//some-cdn',
          relative: true
          scripts:
            bundle: [
              'target/assets/**/*.js'
              '!target/assets/scripts/routes.js'
            ]

          styles:
            bundle: ['target/assets/stylesheets/**/*.css']

          data:
            environment: 'dev'
    sync:
      default:
        files: [
          cwd: 'dev/assets'
          src: [ # sync everytthing but coffee and sass files
            '**'
            '!**/*.coffee'
            '!**/*.sass'
          ]
          dest: 'target/assets'
        ]

    clean: ['target']

    watch:
      coffeescript:
        files: ['dev/assets/**/*.coffee']
        tasks: [
          'coffee'
          'htmlbuild'
        ]

      compass:
        files: ['dev/assets/**/*.sass']
        tasks: ['compass']

      stylesheets:
        files: ['dev/assets/stylesheets/**/*.sass']
        tasks: ['htmlbuild']

      sync_assets:
        files: ['dev/assets/**']
        tasks: ['sync']

      index:
        files: ['dev/index.html']
        tasks: ['htmlbuild']

      livereload:
        files: ['target/**/*']
        options:
          livereload: true


  # load all tasks declared in devDependencies
  Object.keys(require('./package.json').devDependencies).forEach (dep) ->
    grunt.loadNpmTasks dep if dep.substring(0, 6) is 'grunt-'
    return
  
  # setup our workflow
  grunt.registerTask 'default', [
    'coffee'
    'compass'
    'sync'
    'htmlbuild'
    'watch'
  ]
  return