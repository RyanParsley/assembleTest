/*
 * assembleTest
 * 
 * Ryan Parsley
 * https://github.com/ryan.parsley/assembleTest
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
'use strict';


  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),


    // Before generating any new files, remove files from previous build.
    clean: {
      example: ['<%= site.dest %>/*.html'],
      // Delete this target after first run!!!
    },


    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Build HTML from templates and data
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
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },
    githubPages: {
      target: {
        options: {
          // The default commit message for the gh-pages branch
          commitMessage: 'push'
        },
        // The folder where your gh-pages repo is
        src: '_gh_pages'
      }
    },

    // Compile SASS to CSS
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          '<%= site.assets %>/style/style.css': 'style/style.scss'       // 'destination': 'source'
        }
      }
    },
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
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
        // Here we watch the files the sass task will compile to
        // These files are sent to the live reload server after sass compiles to them
        options: { livereload: true },
        files: ['<%= site.dest %>/*.html', 'style/{,*/}*.{scss,sass}'],
      },
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-github-pages');

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'compass', 'watch:site']);

  grunt.registerTask('docs', ['readme', 'sync']);

  grunt.registerTask('default', ['clean', 'jshint', 'assemble', 'compass', 'docs']);

  grunt.registerTask('deploy', ['githubPages:target']);
};
