module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({

    // Get package JSON
    pkg: grunt.file.readJSON('package.json'),

    // JSBeautify
    jsbeautifier: {
      riggr: {
        src: 'src/**/*.js',
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },

    // JSHint
    jshint: {
      riggr: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: 'src/**/*.js'
        }
      }
    },

    // Uglify
    uglify: {
      riggr: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [ 'jsbeautifier', 'jshint', 'uglify' ]);

};