module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai'],

    reporters: ['progress', 'coverage'],

    files: [
      // libraries
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      // app
      'src/ez-spinner.js',
      'dist/ez-spinner-tpl.js',

      // tests
      'test/*Spec.js',
    ],

    preprocessors: {
      'src/ez-spinner.js': ['coverage']
    },

    coverageReporter: {
      type : 'html',
      dir : 'test/coverage/'
    },

    background: false,

    port: 1234,

    browsers: ['Chrome']
  });
};
