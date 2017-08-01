module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n* BY Xian Li<kagurahun@gmail.com>*/\n'
      },
      build: {
//        src: 'src/<%= pkg.name %>.js',
//        dest: 'build/<%= pkg.name %>.min.js'
          files: {
              'prod/erika-core.min.js': ['Erika.js','Core/*.js', 'utils/*.js' ]
          }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'Erika.js','Core/*.js', 'utils/*.js']
    },
    copy: {
        main: {
            files: [
              {expand: true, src: ['Erika.js', 'Core/**', 'utils/**'], dest: 'tmp/', filter: 'isFile'},
            ],
      },
    },
    concat: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> \n* BY Xian Li<kagurahun@gmail.com>*/',
        },
        dist: {
          src: ['tmp/**'],
          dest: 'dev/Erika.js',
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
