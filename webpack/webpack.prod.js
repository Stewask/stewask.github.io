'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const config = {
  output: {
    publicPath: 'build/'
  },
  module: {
    rules: [{
      test: /\.sass$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader?minimize'
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [autoprefixer()]
          }
        },
        {
          loader: 'sass-loader'
        }]
      })
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('css/bundle.css')
  ]
};

module.exports = config;
