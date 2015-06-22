var gulp = require('gulp');
var karma = require('karma').server;

gulp.task('test', ['specs'], function(done) {
  karma.start({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, done);
});


