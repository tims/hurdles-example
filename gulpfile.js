var gulp = require('gulp')
var requireDir = require('require-dir');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var runSequence = require('run-sequence');

requireDir('./gulp');

gulp.task('default', ['config-default', 'clean'], function () {
  return gulp.start('serve');
});

gulp.task('dist', ['config-dist', 'clean'], function () {
  return gulp.start('build');
});

gulp.task('clean', function () {
  return gulp.src(['dist'])
    .pipe(vinylPaths(del));
});

gulp.task('ci', function (cb) {
  runSequence('clean', 'build', 'test', cb);
});
