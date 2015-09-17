/* jshint node: true */
'use strict';
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var noop = function() {
};
var stylish = require('gulp-jscs-stylish');
var jsonlint = require('gulp-jsonlint');
var sloc = require('gulp-sloc');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var compressor = require('gulp-compressor');
var util = require('gulp-util');

var options = {
  param: { // Project settings
    debug: false,
    build: 'build',
    dist: 'dist'
  }
};

var lintSources = [
  '**/*.js',
  '!' + options.param.build + '/**',
  '!' + options.param.dist + '/**',
  '!example/fxos-j5*/*-bundle.js',
  '!example/fxos-j5*/bower_components/**',
  '!example/cordova-j5*/www/js/*-bundle.js',
  '!example/cordova-j5*/www/bower_components/**',
  '!example/cordova-j5*/plugins/**',
  '!example/cordova-j5*/platforms/**',
  '!node_modules/**'
];

gulp.task('jsonlint', function() {
  return gulp.src([
    '**/*.json',
    '!' + options.param.build + '/**',
    '!' + options.param.dist + '/**',
    '!example/fxos-j5*/*-bundle.js',
    '!example/fxos-j5*/bower_components/**',
    '!example/cordova-j5*/www/js/*-bundle.js',
    '!example/cordova-j5*/www/bower_components/**',
    '!example/cordova-j5*/plugins/**',
    '!example/cordova-j5*/platforms/**',
    '!node_modules/**'])
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('sloc', function() {
  return gulp.src(lintSources)
    .pipe(sloc());
});

gulp.task('clean', function(cb) {
  return del([
    'example/fxos-j5/*-bundle.js',
    'example/cordova-j5/www/js/*-bundle.js',
    options.param.build,
    options.param.dist
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

gulp.task('build-ble-serialport', function() {
  gulp.src('ble-serialport-bundle-entry.js')
    .pipe(browserify({
      ignore: ['noble'],
      debug: options.param.debug
    }))
    .pipe(rename('ble-serialport-bundle.js'))
    .pipe(gulp.dest(options.param.build));
});

gulp.task('build-firmata', function() {
  gulp.src('firmata-bundle-entry.js')
    .pipe(browserify({
      ignore: ['noble', 'debug'],
      debug: options.param.debug
    }))
    .pipe(rename('firmata-bundle.js'))
    .pipe(gulp.dest(options.param.build));
});

gulp.task('build-j5', function() {
  gulp.src('j5-bundle-entry.js')
    .pipe(browserify({
      ignore: ['noble', 'debug', 'board-io', 'es6-shim'],
      debug: options.param.debug
    }))
    .pipe(rename('j5-bundle.js'))
    .pipe(gulp.dest(options.param.build));
});

//FIXME: currently have problem running compressed script
gulp.task('compress', function() {
  gulp.src('build/*.js')
    .pipe(compressor({
      'executeOption': {
        maxBuffer: 10000 * 1024
      }
    }).on('error', util.log))
    .pipe(rename(function(path) {
      path.basename += '-min';
    }))
    .pipe(gulp.dest(options.param.dist));
});

gulp.task('build', ['build-ble-serialport', 'build-j5', 'build-firmata']);

//FIXME: currently compress won't work with a clean build
gulp.task('dist', function() {
  gulp.src('build/*.js')
    .pipe(gulp.dest('example/fxos-j5/'))
    .pipe(gulp.dest('example/cordova-j5/www/js/'));
  //gulp.start('compress');
});

gulp.task('githooks', function() {
  return gulp.src(['pre-commit'])
    .pipe(gulp.dest('.git/hooks'));
});

