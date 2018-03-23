const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./config.js');

module.exports = _.merge({}, config, {
  output: {
    path: path.resolve(__dirname, '../build/prod'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src' },
      { from: './node_modules/sweetalert2/dist/sweetalert2.min.css', to: './css/' },
    ], {
      ignore: ['js/**/*'],
      copyUnmodified: false,
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        output: {
          comments: false,
          beautify: false,
        },
        compressor: {
          warnings: false,
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      }
    }),
  ],
});
