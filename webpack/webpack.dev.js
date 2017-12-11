import webpack from 'webpack';
import { paths } from './util';

export default {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    inline: true,
    hot: true,
    port: 3001,
    contentBase: [paths.build, paths.pug],
    watchContentBase: true
  },
  output: {
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.sass$/,
      exclude: /node_modules/,
      use: [
        { loader: 'style-loader?sourceMap' },
        { loader: 'css-loader?sourceMap' },
        { loader: 'sass-loader?sourceMap' }
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
