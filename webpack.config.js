'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');

const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === 'production';

const baseOpts = {
  context: srcPath,
  name: '[path][name].[ext]',
  publicPath: isProduction ? '../' : ''
};

const cssAssetOpts = mimetype => Object.assign({}, baseOpts, {
  mimetype
});

const htmlAssetOpts = mimetype => Object.assign({}, baseOpts, {
  mimetype,
  publicPath: ''
});

const rules = [{
  test: /\.js$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'eslint-loader',
},
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    query: {
      presets: [
        ['env', {
          targets: {
            ie: 11
          }
        }]
      ]
    }
  }
},
{
  test: /\.woff2?$/,
  use: {
    loader: 'file-loader',
    options: cssAssetOpts('application/font-[ext]')
  }
},
{
  test: /\.[ot]tf$/,
  use: {
    loader: 'file-loader',
    options: cssAssetOpts('application/octet-stream')
  }
},
{
  test: /\.eot$/,
  use: {
    loader: 'file-loader',
    options: cssAssetOpts('application/vnd.ms-fontobject')
  }
},
{
  test: /\.pdf$/,
  use: {
    loader: 'file-loader',
    options: htmlAssetOpts('application/pdf')
  }
},
{
  test: /\.svg$/,
  use: [{
    loader: 'file-loader',
    options: htmlAssetOpts('image/svg+xml')
  },
  {
    loader: 'img-loader',
    options: {
      svgo: {
        plugins: [
          { removeUselessDefs: false },
          { cleanupIDs: false },
          { removeTitle: true },
          { removeDesc: true },
          { sortAttrs: true },
          { removeDimensions: true },
          { removeAttrs: { attrs: 'stroke.*' } }
        ]
      }
    }
  }]
},
{
  test: /\.png$/,
  use: [{
    loader: 'file-loader',
    options: htmlAssetOpts('image/png')
  },
  {
    loader: 'img-loader?minimize'
  }]
},
{
  test: /\.jpg$/,
  use: [{
    loader: 'file-loader',
    options: cssAssetOpts('image/jpeg')
  },
  {
    loader: 'img-loader',
    options: {
      minimize: true,
      mozjpeg: {
        progressive: true,
        quality: 70
      }
    }
  }]
},
{
  test: /\.pug$/,
  use: 'pug-loader?pretty=true'
}];

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'index.pug'),
    filename: '../index.html',
    minify: false
  }),
  new webpack.ProgressPlugin(),
];

if (isProduction) {
  rules.push({
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
  });

  plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('css/bundle.css')
  );
} else {
  rules.push({
    test: /\.sass$/,
    exclude: /node_modules/,
    use: [
      { loader: 'style-loader?sourceMap' },
      { loader: 'css-loader?sourceMap' },
      { loader: 'sass-loader?sourceMap' }
    ]
  });

  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
}

module.exports = {
  entry: path.join(srcPath, 'js', 'script.js'),
  devServer: {
    inline: true,
    hot: true,
    port: 3001,
  },
  output: {
    path: buildPath,
    filename: path.join('js', 'bundle.js'),
    publicPath: 'build/'
  },
  module: {
    rules
  },
  plugins
};
