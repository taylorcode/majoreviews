module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      client:
        expand: true
        cwd: 'client/dev/assets'
        src: ['**/*.coffee']
        dest: 'client/target/assets'
        ext: '.js'
      server:
        expand: true
        cwd: 'server/dev'
        src: ['**/*.coffee']
        dest: 'server/target'
        ext: '.js'
      entry:
        src: 'web.coffee'
        dest: 'web.js'

    compass:
      default:
        options:
          sassDir: 'client/dev/assets/stylesheets'
          cssDir: 'client/target/assets/stylesheets'

    htmlbuild:
      default:
        src: 'client/dev/index.html'
        dest: 'client/target/'
        options:
          beautify: true
          
          #prefix: '//some-cdn',
          relative: true
          scripts:
            bundle: [
              'client/target/assets/scripts/libs/**/*.js'
              'client/target/assets/scripts/src/routes.js'
              'client/target/assets/scripts/src/**/*.js'
              'client/target/assets/views/**/*.js'
            ]

          styles:
            bundle: ['client/target/assets/stylesheets/**/*.css']

          data:
            environment: 'dev'
    sync:
      client:
        files: [
          cwd: 'client/dev/assets'
          src: [ # sync everytthing but coffee and sass files
            '**'
            '!**/*.coffee'
            '!**/*.sass'
          ]
          dest: 'client/target/assets'
        ]
      server:
        files: [
          cwd: 'server/dev'
          src: [ # sync everytthing but coffee and sass files
            '**'
            '!**/*.coffee'
          ]
          dest: 'server/target'
        ]

    clean: ['client/target']

    watch:
      clientCoffee:
        files: ['client/dev/assets/**/*.coffee']
        tasks: [
          'htmlbuild'
        ]
      allCoffee:
        files: ['**/*.coffee']
        tasks: [
          'coffee'
        ]
      compass:
        files: ['client/dev/assets/**/*.sass']
        tasks: ['compass']

      stylesheets:
        files: ['client/dev/assets/stylesheets/**/*.sass']
        tasks: ['htmlbuild']

      sync_assets:
        files: ['client/dev/assets/**', 'server/dev/**',]
        tasks: ['sync']

      index:
        files: ['client/dev/index.html']
        tasks: ['htmlbuild']

      # livereload:
      #   files: ['client/target/**/*']
      #   options:
      #     livereload: true


  # load all tasks declared in devDependencies
  Object.keys(require('./package.json').devDependencies).forEach (dep) ->
    grunt.loadNpmTasks dep if dep.substring(0, 6) is 'grunt-'
    return
  
  # setup our workflow
  grunt.registerTask 'default', [
    'clean'
    'coffee'
    'compass'
    'sync'
    'htmlbuild'
    'watch'
  ]
  return