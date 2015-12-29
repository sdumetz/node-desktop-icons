const datadirs = require('./datadirs')
    , fs = require('fs')
    , path = require('path');

const Theme = require('./Theme');

function Themes (){
  this.list = {}; //default icons theme
  datadirs.map(function(dir){
    return new Promise((resolve, reject)=> {
      fs.readdir(dir,(err,files)=>{
        if(err) return reject(err);
        resolve(this.parse(dir,files));
      });
    });
  });
}
Themes.prototype.parse = function (dir,files) {
  return new Promise((resolve, reject)=> {
    files.forEach((file)=>{
      if(typeof this.list[file] === "undefined"){
        this.list[file] = new Theme(file);
      }
      this.list[file].push(path.join(dir,file));
    });
  });
};
module.exports = Themes;
