const path = require('path')
    , fs = require('fs')
    , parse = require("xdg-parse");

function Theme(source,data){
  var rawdata = parse(data);
  this.sources = [source];
  var theme = rawdata["Icon Theme"]
  var directories = theme["Directories"]
  if(typeof directories === "string"){
    directories = directories.split(",").reduce((obj,dir,index,orig)=>{
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

module.exports = Theme;
