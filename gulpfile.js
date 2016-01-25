var gulp = require('gulp'),
    gulpif = require('gulp-if'),/*流程控制*/
    Rev = require('gulp-rev-all'),
    path = require('path'),
    inject = require('gulp-inject'),
    del = require('del'),/*删除文件夹*/
    merge = require('merge-stream'),/*合并stream,返回很重要*/
    fs = require("fs"),
    _ = require("underscore")
    ;

var moduleList = function(dir){
    var list = [];
    fs.readdirSync(dir).forEach(function(file){
        var name = [dir,file].join('/');
        var isDir = fs.statSync(name).isDirectory();
        if(isDir){
            list.push(name)
        }}
    );
    return list;
};


var CDN_URL = process.env.CDN_URL;
//打包变量 是否生产，是否使用cdn
var isDeploy = 0,isCDN = 0;


var revAll;
gulp.task("default",["html:inject"],function(){
    console.log(123);
});

gulp.task("html:copy",function(){
    console.log("copy");
    var htmlStream = gulp.src('./src/app/**/*.html',{base:"./src"})
        .pipe(gulp.dest("./build"));
    return merge(htmlStream);
});

gulp.task("html:inject",function(){
    var _moduleList = moduleList("./src/app");
    console.log(_moduleList);
    //gulp.src('./build/app/**/*.html',{base:'.'}).pipe(inject(gulp))
    for(var i=0;i<_moduleList.length;i++){
        console.log(_moduleList[i]);
        gulp.src(_moduleList[i]+'/*.html',{base:'./src'})
            .pipe(inject(gulp.src(["./build/app/common/*.js",_moduleList[i].replace("./src/","./build/")+"/*.js"]),{
                transform:function(filePath,file,index,length,targetFile){
                    var jsFileName = _.last(filePath.split("/")).replace(".js","");
                    var htmlFileName = _.last(targetFile.path.split("/")).replace(".html","");
                    console.log(jsFileName,htmlFileName);
                    if(jsFileName.startsWith(htmlFileName)){
                        return '<script src="./'+jsFileName+'.js"></script>';
                    }else if(jsFileName.startsWith("vendors")){
                        return '<script src="../common/'+jsFileName+'.js"></script>';
                    }else{
                        return "";
                    }
                }
            })).pipe(gulp.dest("./build"));
    }
});

gulp.task('rev-all-cdn',function(){
    var revOption = {dontRenameFile:['.html','.css','.js'],hashLength:12};
    console.log(CDN_URL);
    if(CDN_URL){
        _.extend(revOption,{
            transformPath:function(rev,source,path){
                // path.revPath 相对路径变为相对的绝对路径，并非从root开始的，无斜杠开头;
                // path.cwd 项目路径;path.base gulp的主路径;path.revOrigPath 未hash化的绝对路径
                //console.log("123");
                return CDN_URL + "/"+path.revPath;
            }
        });
    }
    revAll = new Rev(revOption);
    gulp.src('./build/app/**',{base:"./build"})
        .pipe(revAll.revision())
        .pipe(gulp.dest("./build"));
});
//gulp.task('clean',function(){
//    del(BUILD_PATH);//清理cdn包
//});


