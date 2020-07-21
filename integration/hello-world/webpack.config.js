const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/main.ts',
  },
  module: {
    rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: resolve(__dirname, 'public/target'),
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 7000,
  },
};
