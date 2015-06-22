var gulp =  require('gulp');

var config = {
  production: false,
  justLogErrors: false
};

gulp.task('config-dist', function() {
  config.production =  true;
});

gulp.task('config-default', function() {
  config.justLogErrors =  true;
});

module.exports = config;