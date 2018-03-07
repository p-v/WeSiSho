const _ = require('lodash');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VersionFilePlugin = require('webpack-version-file-plugin');

const config = require('./config.js');


module.exports = _.merge({}, config, {
  output: {
    path: path.resolve(__dirname, '../build/dev'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src' }
    ], {
      ignore: ['js/**/*', "html/**/*", 'manifest.json'],
      copyUnmodified: false
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/popup.html',
      filename: "html/popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/options.html',
      filename: "html/options.html",
      chunks: ["options"]
    }),
    new VersionFilePlugin({
      packageFile: path.resolve(__dirname, '../package.json'),
      template: path.resolve(__dirname, '../src/manifest.json'),
      outputFile: path.resolve(__dirname, '../build/dev/manifest.json'),
    })
  ],
  watch: true
});
