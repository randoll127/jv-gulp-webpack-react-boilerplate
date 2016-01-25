import fs from "fs";
var findEntry = function(ext){
    fs.readdir(__dirname,function(err,files){
        files
            .filter(function(file){
                return file.substr(-5) === '.html';
            })
            .forEach(function(file){
                fs.readFile(file,'utf-8',function(err,contents){
                    inspectFile(contents);
                });
            });
    });
}
var fileList = function(dir){
    return fs.readdirSync(dir).reduce(function(list,file){
        var name = [dir,file].join('/');
        var isDir = fs.statSync(name).isDirectory();
        return list.concat(isDir?fileList(name):[name]);
    },[]);
};
var fiterFile = function({targetDir,ext="html",excludeDir}){
    if(!targetDir) return null;
    return fileList(targetDir).filter(function(file){
        return file.substr(-4) === ext&&(!excludeDir||file.indexOf("/"+excludeDir+"/")!==-1);
    })
};


export  {findEntry,fileList,fiterFile};