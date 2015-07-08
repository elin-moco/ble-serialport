/* jshint node: true */
'use strict';
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var noop = function() {};
var stylish = require('gulp-jscs-stylish');
var jsonlint = require('gulp-jsonlint');
var sloc = require('gulp-sloc');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var options = {
  param: { // Project settings
    debug: false,
    build: 'build'
  }
};

var lintSources = [
    '**/*.js',
    '!build/**',
    '!node_modules/**'
  ];

gulp.task('jsonlint', function() {
  return gulp.src([
      '**/*.json',
      '!node_modules/**'
    ])
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('sloc', function() {
  gulp.src(lintSources)
    .pipe(sloc());
});

gulp.task('clean', function(cb) {
  del([
    options.param.build
  ], cb);
});

/**
 * Runs JSLint and JSCS on all javascript files found in the app dir.
 */
gulp.task('lint', ['jsonlint', 'sloc'],
  function() {
    return gulp.src(lintSources)
      .pipe(jshint('.jshintrc'))
      .pipe(jscs('.jscsrc'))
      .on('error', noop) // don't stop on error
      .pipe(stylish.combineWithHintResults())
      .pipe(jshint.reporter('default'));
  });

gulp.task('build-firmata', function() {
    gulp.src('firmata-bundle-entry.js')
        .pipe(browserify({
          ignore: ['debug', 'serialport', 'browser-serialport'],
          debug: options.param.debug
        }))
        .pipe(rename('firmata-bundle.js'))
        .pipe(gulp.dest(options.param.build));
  });

gulp.task('build-j5', function() {
    gulp.src('j5-bundle-entry.js')
        .pipe(browserify({
          ignore: ['debug', 'browser-serialport', 'board-io', 'es6-shim'],
          debug: options.param.debug
        }))
        .pipe(rename('j5-bundle.js'))
        .pipe(gulp.dest(options.param.build));
  });

gulp.task('githooks', function() {
  return gulp.src(['pre-commit'])
    .pipe(gulp.dest('.git/hooks'));
});

