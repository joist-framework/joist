const { join } = require('path');

const config = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: join(__dirname, 'public/target'),
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';

    config.devServer = {
      contentBase: join(__dirname, 'public'),
      historyApiFallback: true,
      writeToDisk: true,
    };
  }

  return config;
};
