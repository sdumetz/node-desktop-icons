var Theme = require("../lib/Theme");
var fs = require('fs');
describe("Theme",function(){
  var themedata;
  var path = __dirname+"/fixtures/birch"
  before(function(done){
    fs.readFile(path+"/index.theme",{encoding:'utf8'},function(err,data){
      themedata = data;
      done();
    })
  })
  beforeEach(function() {
    this.theme = new Theme(path,themedata);
  })
  it("matchSize() : Fixed",function(){
    expect(this.theme.matchSize(32,"32x32/apps")).to.be.true;
    expect(this.theme.matchSize(31,"32x32/apps")).to.be.false;
  });
  it("matchSize() : Scalable",function(){
    expect(this.theme.matchSize(48,"scalable/apps")).to.be.true;
    expect(this.theme.matchSize(2,"scalable/apps")).to.be.true;
    expect(this.theme.matchSize(255,"scalable/apps")).to.be.true;
    expect(this.theme.matchSize(257,"scalable/apps")).to.be.false;
  });
  it("findIcon() filter size candidates",function(done){
    this.theme.openIcon = function(dirs){
      expect(dirs).to.deep.equal([
        '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/48x48/apps/hello',
        '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/48x48/mimetypes/hello',
        '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/scalable/apps/hello',
        '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/scalable/mimetypes/hello'
      ]);
      done();
    }
    this.theme.findIcon("hello",48);
  });
  it("openIcon() find existing icons",function(done){
    this.theme.openIcon([
      '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/scalable/apps/test.png',
      '/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/32x32/apps/test.png'
    ],function(err,res){
      expect(err).to.be.null;
      expect(res).to.equal('/home/sebastien/repositories/node-desktop-icons/test/fixtures/birch/32x32/apps/test.png');
      done();
    })
  })
})
