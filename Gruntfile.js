module.exports = function (grunt) {

    var coreFile = 'Erika.js';
    var resourceFiles = [coreFile, 'Core/*.js', 'utils/*.js', 'dom/*.js', 'components/*.js', 'components/*/*.js'];
    var allFiles = ['Gruntfile.js', coreFile, 'Core/*.js', 'utils/*.js', 'dom/*.js', 'components/*.js', 'components/*/*.js'];
    var devDir = 'dev/';
    var tmpDir = 'tmp/';
    var version = '<%= pkg.version %>';
    var sassDir = 'sass/';
    var cssDir = 'css/';
    var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> \n* BY Xian Li<kagurahun@gmail.com>*/';


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: banner
            },
            build: {
                //        src: 'src/<%= pkg.name %>.js',
                //        dest: 'build/<%= pkg.name %>.min.js'
                files: {
                    'prod/erika-core.min.js': resourceFiles
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                esversion: 6,
            },

            build: allFiles
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: resourceFiles,
                        dest: tmpDir,
                        filter: 'isFile'
                    },
            ],
            },
        },
        concat: {
            options: {
                stripBanners: true,
                banner: banner,
            },
            dist: {
                src: [tmpDir + '**'],
                dest: devDir + coreFile,
            },
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    //'css/erika-ui.css': 'scss/erika-ui.scss'
                }
            },
            compile: {
				files: {
					'css/erika-ui.css': 'scss/erika-ui.scss'
				}
            },
            includePaths: {
				options: {
					includePaths: ['scss']
				},
				files: {
					'css/erika-ui.css': 'scss/erika.scss'
				}
			},
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');

    
    grunt.registerTask('default', ['jshint', 'uglify', 'sass']);
    grunt.registerTask('build', ['jshint', 'copy', 'concat', 'sass']);
    grunt.registerTask('build-dev', ['jshint', 'copy', 'sass']);
    grunt.registerTask('build-sass', ['sass']);

};
