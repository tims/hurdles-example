module.exports = function(config) {
  var files = [
    'dist/specs/bundle.js'
  ];

  config.set({
    basePath: './',

    files: files,

    exclude: [],

    autoWatch: true,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-phantomjs-launcher'
    ],

    junitReporter: {
      outputFile: 'unit.xml',
      suite: 'unit'
    }
  });
};