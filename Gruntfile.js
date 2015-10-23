/*
 * assembleTest
 *
 * Ryan Parsley
 * https://github.com/ryanparsley/assembleTest
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('assemble');

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),

    clean: {
      example: ['<%= site.dest %>/*.html'],
    },

    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',
        postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>',
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },
    'gh-pages': {
      options: {
        base: '_gh_pages'
      },
      target: {
        src: ['**']
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= site.assets %>/style/style.css': 'style/style.scss'
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'style',
          cssDir: '<%= site.assets %>/style',
          environment: 'production'
        }
      },
    },
    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint'],
      },
      site: {
        files: ['Gruntfile.js', 'style/style.scss', 'templates/**/*.hbs'],
        tasks: ['design'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: { livereload: true },
        files: ['<%= site.dest %>/*.html', 'style/{,*/}*.{scss,sass}'],
      },
    },
    kss: {
      options: {
        css: '../assets/style/style.css',
      },
      dist: {
        files: {
          '_gh_pages/styleguide': 'style',
        }
      }
    }
  });

  grunt.registerTask('design', ['clean', 'assemble', 'compass', 'watch:site']);

  grunt.registerTask('docs', ['readme', 'sync']);

  grunt.registerTask('styleguide', ['kss']);

  grunt.registerTask('default', ['clean', 'jshint', 'assemble', 'compass', 'docs']);

  grunt.registerTask('deploy', ['gh-pages:target']);
};
