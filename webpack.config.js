const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

process.env.BABEL_ENV = 'production';

module.exports = {
  resolve: {
		modules: ['node_modules'],
    extensions: ['.ts'],
  },
  mode: 'production',
  stats: "verbose",
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true
    })],
  },
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
        {   
            test: /\.ts$/, 
            loader: 'babel-loader?cacheDirectory', 
            exclude: /node_modules/,
            options: {
                presets: [
                  ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
                  ["@babel/preset-env"]
                ],
                plugins: [
                        ["@babel/plugin-proposal-object-rest-spread"],
                        ["@babel/plugin-proposal-class-properties"],
                ]
            }
        },
      ]
  }
}
