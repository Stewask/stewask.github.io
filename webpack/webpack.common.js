'use strict';

const path = require('path');
const webpack = require('webpack');
const { cssAssetOpts, htmlAssetOpts, paths } = require('./util');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const config = (env) => {
  const isProduction = env === 'prod';
  const cssAsset = cssAssetOpts(isProduction);

  return {
    entry: path.join(paths.src, paths.js),
    output: {
      filename: paths.js,
      path: paths.build
    },
    module: {
      rules: [{
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
          options: cssAsset('application/font-[ext]')
        }
      },
      {
        test: /\.[ot]tf$/,
        use: {
          loader: 'file-loader',
          options: cssAsset('application/octet-stream')
        }
      },
      {
        test: /\.eot$/,
        use: {
          loader: 'file-loader',
          options: cssAsset('application/vnd.ms-fontobject')
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
          options: cssAsset('image/jpeg')
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
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.pug,
        filename: isProduction ? '../index.html' : 'index.html',
        minify: false,
        inject: true
      }),
      new webpack.ProgressPlugin(),
      new FaviconsWebpackPlugin({
        logo: path.join(paths.src, 'assets', 'img', 'orion.png'),
        prefix: path.join('assets', 'img', 'favicon-'),
        background: 'rgba(0, 0, 0, 0)',
        emitStats: false,
        inject: true,
        persistentCache: false,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      })
    ]
  };
};

module.exports = config;
