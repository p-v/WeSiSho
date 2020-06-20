const path = require('path');

module.exports = {
  entry: {
    background: './src/background/index.ts',
    app: './src/app.ts',
    options: './src/options/index.tsx',
    popup: './src/popup/index.tsx',
  },
  output: {
    filename: './js/[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              localsConvention: 'camelCase',
              modules: true,
              sourceMap: true,
              importLoaders: 2,
            },
          },
        ],
      },
      {
        test: /.woff$|.woff2$|.ttf$|.eot$|.svg$/,
        loader: 'file-loader',
      },
    ],
  },
};
