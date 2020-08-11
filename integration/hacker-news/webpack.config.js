const { join } = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');

const config = {
  mode: 'development',
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
    path: join(__dirname, 'public'),
  },
  devServer: {
    contentBase: join(__dirname, 'public'),
    historyApiFallback: true,
    writeToDisk: true,
  },
  plugins: [],
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.performance = { hints: 'error', maxEntrypointSize: 30000 };
    config.plugins.push(new GenerateSW());
  }

  return config;
};
