const _ = require('lodash');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VersionFilePlugin = require('webpack-version-file-plugin');

const config = require('./config.js');

module.exports = _.merge({}, config, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../build/dev'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src' },
      { from: './node_modules/bootstrap/dist/', to: './bootstrap/' },
      { from: './node_modules/sweetalert2/dist/sweetalert2.min.css', to: './css/' },
    ], {
      ignore: ['js/**/*', 'manifest.json'],
      copyUnmodified: false
    }),
    new VersionFilePlugin({
      packageFile: path.resolve(__dirname, '../package.json'),
      template: path.resolve(__dirname, '../src/manifest.json'),
      outputFile: path.resolve(__dirname, '../build/dev/manifest.json'),
    })
  ],
  watch: true
});
