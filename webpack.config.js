'use strict';

const commonConfig = require('./webpack/webpack.common');
const webpackMerge = require('webpack-merge');

module.exports = (env) => {
  const envConfig = require(`./webpack/webpack.${env}`);

  return webpackMerge(commonConfig(env), envConfig);
};
