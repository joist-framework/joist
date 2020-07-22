const { resolve } = require('path');

const config = {
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
  plugins: [],
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.performance = { hints: 'error', maxEntrypointSize: 7000 };
  }

  return config;
};
