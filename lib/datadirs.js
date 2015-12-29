const path = require('path');
var data = require('xdg-basedir').dataDirs;
data = data.map(function(dir){return path.join(dir,"icons")});
data.unshift(path.join(process.env["HOME"],".icons"))
data.push("/usr/share/pixmaps ");
module.exports = data;
