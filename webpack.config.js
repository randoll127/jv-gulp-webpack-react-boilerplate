/*Config配置*/
var PLATFORM = process.env.PLATFORM||"hybrid";//平台,hybrid or html5
var BUILD_VERSION = process.env.BUILD_VERSION||"product";//product or debug
var ENV = require("./scripts/config/env.config.js")[BUILD_VERSION];//全局变量配置文件
var PLATFORM_CONFIG = require("./scripts/config/"+PLATFORM+".config.js")(ENV)[BUILD_VERSION];//平台配置文件

/*加载mokuai*/
var path = require("path");
var webpack = require("webpack");
var _ = require("lodash");


var webpackConfigJSON = _.assign({
  entry: [
    //'eventsource-polyfill', // necessary for hot reloading with IE
    //'webpack-hot-middleware/client',
    './src/demo/index'
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
  },PLATFORM_CONFIG);

console.log(webpackConfigJSON)

module.exports = webpackConfigJSON;