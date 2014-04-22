module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            default: {
                expand: true,
                cwd: 'dev/assets',
                src: ['**/*.coffee'],
                dest: 'target/assets',
                ext: '.js'
            }
        },

        compass: {
            default: {
                options: {
                    sassDir: 'dev/assets/stylesheets',
                    cssDir: 'target/assets/stylesheets'
                }
            }
        },

        /*compass: { // Task
            default: { // Target
                options: { // Target options
                    sassDir: 'dev/assets',
                    cssDir: 'target/assets/stylesheets',
                    environment: 'development'
                }
            },
            // dev: {                    // Another target
            //   options: {
            //     sassDir: 'sass',
            //     cssDir: 'css'
            //   }
            // }
        },*/
        htmlbuild: {
            default: {
                src: 'dev/index.html',
                dest: 'target/',
                options: {
                    beautify: true,
                    //prefix: '//some-cdn',
                    relative: true,
                    scripts: {
                        bundle: [
                            'target/assets/**/*.js',
                            '!target/assets/scripts/routes.js'
                        ]
                    },
                    styles: {
                        bundle: [
                            'target/assets/stylesheets/**/*.css'
                        ]
                    },
                    data: {
                        environment: 'dev'
                    }
                }
            }
        },
        // copy: {
        //     default: {
        //         expand: true,
        //         cwd: 'dev/assets',
        //         src: '**',
        //         dest: 'target/assets',
        //         filter: 'isFile'
        //     }
        // },

        sync: {
            default: {
                files: [{
                    cwd: 'dev/assets',
                    src: ['**', '!**/*.coffee', '!**/*.sass'], // sync everytthing but coffee and sass files
                    dest: 'target/assets'
                }]
            }
        },

        delete_sync: {
            default: {
                cwd: 'target/assets',
                src: ['**', '!**/*.js', '!**/*.css'], // sync everytthing but js and css files
                syncWith: 'dev/assets'
            }
        },


        watch: {
            coffeescript: {
                files: ['dev/assets/**/*.coffee'],
                tasks: ['coffee', 'htmlbuild']
            },
            compass: {
                files: ['dev/assets/**/*.sass'],
                tasks: ['compass']
            },
            stylesheets: {
                files: ['dev/assets/stylesheets/**/*.sass'],
                tasks: ['htmlbuild'] 
            },
            sync_assets: {
                files: ['dev/assets/**'],
                tasks: ['sync', 'delete_sync']
            },
            index: {
                files: ['dev/index.html'],
                tasks: ['htmlbuild'],
            },
            livereload: {
                files: ['target/**/*'],
                options: {
                    livereload: true
                }
            }
        }
        
    });

    // load all tasks declared in devDependencies
    Object.keys(require('./package.json').devDependencies).forEach(function (dep) {
        if (dep.substring(0, 6) == 'grunt-') {
            grunt.loadNpmTasks(dep);
        }
    });

    // setup our workflow
    grunt.registerTask('default', ['coffee', 'compass', 'sync', 'delete_sync', 'htmlbuild', 'watch']);
}