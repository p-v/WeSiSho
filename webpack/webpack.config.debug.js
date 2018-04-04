const _ = require('lodash');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('./webpack.config.dev.js');

module.exports = _.merge({}, config, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../build/debug'),
  },
  watch: true,
});
