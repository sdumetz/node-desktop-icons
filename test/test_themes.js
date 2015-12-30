var Themes = require("../lib");

describe("Themes",function(){
  var themes;
  before(function(){
    themes = new Themes([__dirname+"/fixtures"]);
  })
  it("list() : array of themes",function(done){
    themes.list(function(err,r){
      expect(err).to.be.null;
      expect(r).to.have.members([ 'Birch', 'Hicolor' ]);
      done(err);
    });

  });
  describe("get() : ",function(){
    it("by dirname",function(done){
      themes.get("birch",function(err,theme){
        expect(err).to.be.null;
        expect(theme).to.have.property("Name","Birch");
        done();
      });
    })
    it("by human name",function(done){
      themes.get("Birch",function(err,theme){
        expect(err).to.be.null;
        expect(theme).to.have.property("Name","Birch");
        done();
      });
    })
  })

})
