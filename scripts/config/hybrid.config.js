var webpack = require("webpack");
var path = require("path");
var _ = require("lodash");
module.exports = function(ENV){
    var rootPath = path.join(__dirname,"../../");
    var __devtool = ENV.sourcemap?'source-map':false;
    var __output = {
        path:path.join(rootPath,'build'),
        filename:'bundle.js',
        publicPath:'/static/'
    };
    return {
        "debug":{
            output:__output,
            devtool:__devtool,
            plugins:[
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin(),
                new webpack.DefinePlugin({
                    __DEBUG__:true
                })
            ],
            module:{
                loaders:[{
                    test:/\.js$/,
                    loaders:['babel'],
                    include:path.join(__dirname,'src')
                }]
            }
        },
        "product":{
            output:__output,
            devtool:__devtool,
            plugins:[
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compressor:{
                        warnings:false
                    }
                })
            ],
            module:{
                loaders:[{
                    test:/\.js$/,
                    loaders:['babel'],
                    include:path.join(__dirname,'src')
                }]
            }
        }
    }
};