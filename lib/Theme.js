const path = require('path')
    , fs = require('fs');
function Theme(name){
  this.name = name;
  this.dirs = [];
}
Theme.prototype.push = function(p){
  this.dirs.push(new Promise((resolve, reject)=> {
    fs.readFile(path.join(p,"index.theme"),function(err,data){
      if(err) return reject(err);
      
    });
  }));

}
