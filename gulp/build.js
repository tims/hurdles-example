'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');

var config = require('./config');

function browserifyTask(entries, dest, config) {
  return function () {
    config = config || {};
    var b = browserify({
      entries: entries,
      debug: !config.production,
      transform: [reactify]
    });

    return b.bundle()
      .on('error', function (err) {
        if (config.justLogErrors) {
          gutil.log(gutil.colors.red("Browserify compile error:"), err.message);
          this.emit("end");
        } else {
          gutil.log(gutil.colors.red("Browserify compile error:"), err.message);
          throw err;
        }
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(gulpif(config.production, uglify()))
      .pipe(gulpif(config.production, rev()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest));
  }
};

gulp.task('scripts', browserifyTask(['./src/scripts/main.js'], './dist/scripts', config))
gulp.task('specs', browserifyTask(globby.sync('./src/specs/*.js'), './dist/specs'));

gulp.task('fonts', function () {
  return gulp.src('node_modules/**/fonts/*')
    .pipe(flatten())
    .pipe(gulp.dest('./dist/fonts/'))
});

gulp.task('styles', function () {
  return gulp.src('./src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(config.production, rev()))
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('index', ['styles', 'scripts'], function () {
  var sources = gulp.src(['./dist/scripts/*.js', './dist/styles/*.css'], {read: false});

  return gulp.src('./src/index.html')
    .pipe(inject(sources, {ignorePath: '/dist', addRootSlash: false}))
    .pipe(gulp.dest('dist'));
});


gulp.task('build', ['index', 'scripts', 'styles', 'fonts']);