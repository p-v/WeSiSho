const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config.js');

module.exports = _.merge({}, config, {
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../build/prod'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "html/popup.html",
      template: "./src/popup/index.html",
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: "html/options.html",
      template: "./src/options/index.html",
      chunks: ['options']
    }),
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
    ], {
      copyUnmodified: false,
    }),
    new CopyWebpackPlugin([
      { from: './node_modules/sweetalert2/dist/sweetalert2.min.css', to: './css/' },
      { from: './icons', to: './icons' },
    ], {
      ignore: ['js/**/*'],
      copyUnmodified: false,
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
  ],
});
