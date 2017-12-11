import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { paths } from './util';

const baseOpts = mimetype => ({
  context: paths.src,
  name: '[path][name].[ext]',
  mimetype
});

const cssAssetOpts = isProduction => mimetype => (
  Object.assign({}, baseOpts(mimetype), {
    publicPath: isProduction ? '../' : ''
  })
);

export default env => {
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
        loader: 'babel-loader'
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
          options: baseOpts('application/pdf')
        }
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'file-loader',
          options: baseOpts('image/svg+xml')
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
          options: baseOpts('image/png')
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
      new FaviconsWebpackPlugin({
        logo: path.join(paths.src, paths.img, 'orion.png'),
        prefix: path.join(paths.img, '/'),
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
      }),
      new HtmlWebpackPlugin({
        template: paths.pug,
        filename: isProduction ? '../index.html' : 'index.html',
        minify: false,
        inject: true
      }),
      new webpack.ProgressPlugin()
    ]
  };
};
