const path = require('path')
    , fs = require('fs')
    , parse = require("xdg-parse");

function Theme(source,data){
  var rawdata = parse(data);
  this.sources = [source];
  this.cache = {};
  var theme = rawdata["Icon Theme"]
  var directories = theme["Directories"]
  if(typeof directories === "string"){
    this.directories = directories.split(",").reduce((obj,dir,index,orig)=>{
      if(rawdata[dir])
        obj[dir]= rawdata[dir];
        obj[dir].path=path.join(source,dir);
      return obj;
    },{});
  }
  Object.keys(theme).forEach((key)=>{
    this[key]=theme[key];
  });
}

Theme.prototype.merge = function(p){
  for (var attrname in p) {
    if(attrname === "source"){
      Array.prototype.push.apply(this.sources,p.sources);
    }else {
      this[attrname] = p[attrname];
    }
  }
}

Theme.prototype.findIcon =function(name,size,callback){
  var candidates = Object.keys(this.directories).filter((dir)=>{
    return this.matchSize(size,dir);
  }).map((dir)=>{
    return path.join(this.directories[dir].path,name)
  });
  return this.openIcon(candidates,callback);
}

Theme.prototype.openIcon = function(candidates,callback){
  var candidate = candidates.shift();
  var dir = path.dirname(candidate);
  var file = path.basename(candidate);
  var ispresent = ()=>{
    if(this.cache[dir].indexOf(file) != -1){
      return callback(null,candidate);
    }else{
      return this.openIcon(candidates,callback);
    }
  }
  if(this.cache[dir]){
    return ispresent();
  }else{
    fs.readdir(dir,(err,files)=>{
      if(!err){
        this.cache[dir] = files;
      }else{
        this.cache[dir] =  [];
      }

      return ispresent();//ignore errors.

    });
  }
}
Theme.prototype.matchSize = function(size,dirname){
  var dir = this.directories[dirname];
  if(dir.Type == "Fixed"){
    return size == parseInt(dir.Size);
  }else if(dir.Type == "Scalable"){
    return parseInt(dir.MinSize) <= size && size <=parseInt(dir.MaxSize);
  }
}
module.exports = Theme;
