module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({

    // Get package JSON
    pkg: grunt.file.readJSON('package.json'),

    // JSBeautify Riggr files
    jsbeautifier: {
      riggr: {
        src: 'src/*.js',
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },

    // JSHint Riggr files
    jshint: {
      riggr: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [ 'src/*.js', '!src/indexed.js' ]
        }
      }
    },

    // Uglify Riggr file
    uglify: {
      riggr: {
        options: {
          banner: '/* Part of the Riggr SPA framework <https://github.com/Fluidbyte/Riggr> and released under the MIT license. This notice must remain intact. */\n'
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: '*.js',
          dest: 'dist/'
        }]
      }
    },

    // Copy libs
    copy: {
      libs: {
        files: [{
          expand: true,
          cwd: 'src/lib/',
          src: ['**/*'],
          dest: 'dist/lib/'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [ 'jsbeautifier', 'jshint', 'uglify', 'copy' ]);

};