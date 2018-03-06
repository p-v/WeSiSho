const path = require('path');

module.exports = {
  entry: {
    background: './src/js/background',
    app: './src/js/app',
    options: './src/js/options',
    popup: './src/js/popup',
  },
  output: {
    filename: './js/[name].js',
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, '../src/js'),
    }],
  },
};
