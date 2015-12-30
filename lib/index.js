const datadirs = require('./datadirs')
    , fs = require('fs')
    , path = require('path')
    , parseFile = require("xdg-parse");

const Theme = require('./Theme');

function Themes (dirs){
  dirs = dirs||datadirs;
  this._list = Promise.all(dirs.map(function(dir){
    return new Promise(function(resolve, reject) {
      fs.readdir(dir,function(err,files){
        if(err){
          resolve([]); //ignore errors
        }else{
          resolve(files);
        }
      });
    });
  })).then(function(filesArray){
    return filesArray.reduce(function(array,files,index){
      Array.prototype.push.apply(array,files.map(function(file){
        return path.join(dirs[index],file)
      }));
      return array;
    },[]);
  }).then((subdirs)=>{
    return Promise.all(subdirs.map(this.parseTheme.bind(this)))
      .then(function(lists){
        return lists.reduce(function(list,partial){
          Object.keys(partial).forEach(function(key){
            if(!list[key]){
              list[key] = partial[key];
            }else{
              list[key].merge(partial[key]);
            }
          });
          return list;
        },{});
      });
  });
}
Themes.prototype.parseTheme = function(index){
  var list = {};
  return new Promise(function(resolve, reject) {
    fs.readFile(path.join(index,"index.theme"),{encoding:"utf8"},function(err,data){
      if(!err){
        var searchableName = path.basename(index);
        list[searchableName] = new Theme(index,data);
      }
      resolve(list);
    });
  });

}
Themes.prototype.list = function(callback){
  var ret = this._list.then(function(list){
    return Object.keys(list).map(function(key){ return list[key].Name }).filter(function(name){ return (name)?true:false});
  });
  if(typeof callback === "function"){
    ret.then(function(r){process.nextTick(callback.bind(this,null,r))})
      .catch(function(e){process.nextTick(callback.bind(this,e))}); //never fails
  }
  return ret;
}
Themes.prototype.get = function (name,callback) {
  var ret = this._list.then(function(list){
    var key = Object.keys(list).find(function(el){
      if(el == name){
        return true;
      }else if(list[el].Name == name){
        return true;
      }else{
        return false;
      }
    });
    //console.log("keys" ,key,list[key]);
    return list[key];
  });
  if(typeof callback === "function"){
    ret.then(function(r){process.nextTick(callback.bind(this,null,r))})
      .catch(function(e){process.nextTick(callback.bind(this,e))}); //never fails
  }
  return ret;
};

Themes.prototype.findIcon = function(name,size,callback){
  return this._list.then(function(list){
    return list["hicolor"].findIcon(name,size,callback);
  })
}
module.exports = Themes;
