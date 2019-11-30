const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  new CleanWebpackPlugin(),
  new CopyPlugin([{ from: './src/index.html', to: './index.html' }])
];

const performance = {};

if (process.env.NODE_ENV === 'production') {
  plugins.push(new CompressionPlugin());
  performance.hints = 'error';
  performance.maxEntrypointSize = 30000;
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'eval-source-map',
  entry: {
    main: './src/main.ts'
  },
  module: {
    rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    historyApiFallback: true
  },
  optimization: {
    minimizer: [new TerserPlugin({ terserOptions: { output: { comments: false } } })]
  },
  plugins,
  performance
};
