'use strict';

import commonConfig from './webpack/webpack.common';
import webpackMerge from 'webpack-merge';

export default env => {
  const envConfig = require(`./webpack/webpack.${env}`).default;

  return webpackMerge(commonConfig(env), envConfig);
};
