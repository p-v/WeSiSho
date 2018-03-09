const path = require('path');

module.exports = {
  entry: {
    background: './src/js/background',
    app: './src/js/app',
    options: './src/js/options/index.jsx',
    popup: './src/js/popup/index.jsx',
  },
  output: {
    filename: './js/[name].js',
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../src/js'),
        query: {
          presets: ['env', 'react'],
          plugins: ["transform-object-rest-spread"],
        }
      },
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }
        ]
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            }
          },
        ]
      },
      {
        test: /.woff$|.woff2$|.ttf$|.eot$|.svg$/,
        loader: 'file-loader',
      },
    ],
  },
};
