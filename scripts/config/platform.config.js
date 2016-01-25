import webpack from "webpack";
import path from "path";
import _ from "lodash";
import * as JVUtility from "../node/utility";
var rootPath = process.cwd();
//目前只允许3层 src/app/:module/XXX.html
var __entryCreate = (isDebug) =>{
    var entryObj = {};
    JVUtility.fiterFile({targetDir:path.join(rootPath,"src/app")}).forEach((file)=>{
        file = file.replace(".html","");
        let __val = [];
        __val.push(file + ".js");
        if(isDebug){
            __val.push("webpack-hot-middleware/client");
        }
        var __name = file.replace(path.join(rootPath,"src/"),"");
        if(__name.split("/").length===3){
            entryObj[__name] = __val;
        }else{
            console.error("html path must be 3 levels!!!!!","error path is ==> "+__name);
        }

    });
    if(!isDebug){
        entryObj["vendors"] = ['react','react-dom','react-addons-css-transition-group',
            'underscore','fastclick'];
    }



    return entryObj;
}
let hybridConfig = function(ENV){
    var __devtool = ENV.sourcemap?'source-map':false;
    var __output = {
        path:path.join(rootPath,'build'),
        filename:ENV.debug?'[name].js':'[name]-[hash].js',
        publicPath:ENV.publicPath
    };
    let __entry = __entryCreate(ENV.debug);
    console.log(__entry);
    var __module = {
        loaders:[
            {test:/\.js$/,loaders:['babel'],include:path.join(rootPath,'src')},
            {test:/\.css$/,loaders:["style","css"]},
            {
                test:/\.less$/,
                exclude:/(node_modules|bower_components)/,
                loader:"style-loader!css-loader!less-loader!postcss-loader"
            },
            {
                test:/\.(woff|ttf)$/,
                loader:'url-loader',
                query:{name:"[path][name]-[hash].[ext]",context:path.join(rootPath,"src"),limit:1}
            },{
                test:/\.(png|jpg)$/,
                loader:'url-loader',
                query:{name:"[path][name]-[hash].[ext]",context:path.join(rootPath,'src'),limit:1}
            }
            // inline base64 URLs for <=8k images, direct URLs for the rest
        ]
    };
    return {
        "debug":{
            entry:__entry,
            output:__output,
            devtool:__devtool,
            plugins:[
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin(),
                new webpack.DefinePlugin({
                    __DEBUG__:true
                })
            ],
            module:__module
        },
        "product":{
            entry:__entry,
            output:__output,
            devtool:__devtool,
            plugins:[
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compressor:{
                        warnings:false
                    }
                }),
                new webpack.optimize.CommonsChunkPlugin({names:['vendors'],filename:'app/common/[name]-[hash].js'})
            ],
            module:__module
        }
    }
}
export default {hybrid:hybridConfig};