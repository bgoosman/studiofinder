const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

// Webpack minifies the code by default in production mode (https://webpack.js.org/guides/production/#minification)
module.exports = merge(common, {
  mode: 'production',
});