import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { paths } from './util';

export default {
  output: {
    publicPath: paths.public
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
    new ExtractTextPlugin(paths.css)
  ]
};
