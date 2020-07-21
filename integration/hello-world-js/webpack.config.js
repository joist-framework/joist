const { resolve } = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: resolve(__dirname, 'public/target'),
  },
};
