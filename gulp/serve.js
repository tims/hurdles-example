var gulp = require('gulp');
var webserver = require('gulp-webserver');
var nodemon = require('gulp-nodemon');

gulp.task('webserver', ['build'], function() {
  return gulp.src('dist')
    .pipe(webserver({
      root: 'dist',
      port: 9000,
      livereload: true
    }));
});


gulp.task('api', function () {
  nodemon({
    watch: ['api/src/**/*.js'],
    script: 'api/src/index.js'
  });
});

gulp.task('watch', function() {
  gulp.watch(['./src/styles/**/*.scss'], ['styles']);
  gulp.watch(['./src/scripts/**/*.js'], ['scripts']);
  gulp.watch(['./src/index.html'], ['index']);
});

gulp.task('serve', ['webserver', 'api', 'watch']);
