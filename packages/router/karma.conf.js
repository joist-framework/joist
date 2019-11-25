process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-webpack')
    ],
    files: ['src/test.ts'],
    preprocessors: {
      'src/test.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }]
      },
      resolve: { extensions: ['.ts', '.js'] }
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
