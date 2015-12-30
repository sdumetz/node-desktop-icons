const path = require('path')
    , fs = require('fs')
    , parse = require("xdg-parse");

function Theme(source,data){
  var rawdata = parse(data);
  this.sources = [source];
  var theme = rawdata["Icon Theme"]
  var directories = theme["Directories"]
  if(typeof directories === "string"){
    this.directories = directories.split(",").reduce((obj,dir,index,orig)=>{
      if(rawdata[dir])
        obj[dir]= rawdata[dir];
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
Theme.prototype.findIcon =function(name){
  this.directories.forEach(function (dir) {

  })
}
Theme.prototype.matchSize = function(size,dir){
  if(dir.Type == "Fixed"){
    return size == parseInt(dir.Size);
  }else if(dir.Type == "Scalable"){
    return parseInt(dir.MinSize) <= size && size <=parseInt(dir.MaxSize);
  }
}
module.exports = Theme;
