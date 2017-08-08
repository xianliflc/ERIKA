module.exports = function(grunt) {

    var coreFile        = 'Erika.js';
    var resourceFiles   = [coreFile,'Core/*.js', 'utils/*.js', 'dom/*.js' ];
    var allFiles        = ['Gruntfile.js',coreFile,'Core/*.js', 'utils/*.js', 'dom/*.js' ];
    var devDir          = 'dev/';
    var tmpDir          = 'tmp/';
    var banner          = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
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
        reporter: require('jshint-stylish')
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
                  filter: 'isFile'},
            ],
      },
    },
    concat: {
        options: {
          stripBanners: true,
          banner: banner,
        },
        dist: {
          src: [tmpDir+'**'],
          dest: devDir+coreFile,
        },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint','uglify']);
  grunt.registerTask('build', ['jshint','copy', 'concat']);
  grunt.registerTask('build-dev', ['jshint','copy']);

};
