var _ = require('lodash');
var webpackCfg = require('./webpack.config');

var karmaWebpackCfg = _.merge({
  cache: true,
  devtool: 'inline-source-map'
}, _.pick(webpackCfg,
   'module',
   'resolve'
));

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    files: [
      'spec/index.js'
    ],

    exclude: [],

    preprocessors: {
      'spec/index.js': ['webpack', 'sourcemap']
    },

    webpack: karmaWebpackCfg,

    webpackServer: {
      stats: {
        colors: true
      }
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    captureTimeout: 60000,

    singleRun: false
  });
};

