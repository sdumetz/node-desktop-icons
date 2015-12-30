var Theme = require("../lib/Theme");
var fs = require('fs');
describe("Theme",function(){
  var theme;
  var path = __dirname+"/fixtures/birch"
  before(function(done){
    fs.readFile(path+"/index.theme",{encoding:'utf8'},function(err,data){
      theme = new Theme(path,data);
      done();
    })

  })
  it("matchSize() : Fixed",function(){
    expect(theme.matchSize(32,theme.directories["32x32/apps"])).to.be.true;
    expect(theme.matchSize(31,theme.directories["32x32/apps"])).to.be.false;
  });
  it("matchSize() : Scalable",function(){
    expect(theme.matchSize(48,theme.directories["scalable/apps"])).to.be.true;
    expect(theme.matchSize(2,theme.directories["scalable/apps"])).to.be.true;
    expect(theme.matchSize(255,theme.directories["scalable/apps"])).to.be.true;
    expect(theme.matchSize(257,theme.directories["scalable/apps"])).to.be.false;
  });
})
