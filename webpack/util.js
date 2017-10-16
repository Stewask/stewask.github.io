const path = require('path');

const src = path.join(__dirname, '..', 'src');

exports.paths = {
  src,
  build: path.join(__dirname, '..', 'build'),
  pug: path.join(src, 'index.pug'),
  js: path.join('js', 'script.js')
};

const baseOpts = {
  context: src,
  name: '[path][name].[ext]'
};

exports.cssAssetOpts = isProduction => mimetype => (
  Object.assign({}, baseOpts, {
    mimetype,
    publicPath: isProduction ? '../' : ''
  })
);

exports.htmlAssetOpts = mimetype => Object.assign({}, baseOpts, {
  mimetype,
  publicPath: ''
});
