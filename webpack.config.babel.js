import path from 'path';

export default {
    module: {
      loaders: [
        {
          test: /\.(?:js|es6)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        }
      ]
    },
    entry: {
        app :  path.join(__dirname, "lib", "app"),
        background : path.join(__dirname, "lib", "background")
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    resolve : {
        extensions: ["", ".js", ".es6"],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    }
};
