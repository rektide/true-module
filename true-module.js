var fs= require("fs"),
  resolve= require("resolve")

module.exports= TrueModule

/**
  True-Module
*/

function TrueModule(name){
	var self= this||TrueModule
	console.log("i",require("util").inspect(self))
	var filename= self.resolver(name)
	var contents= self.read(filename)
	var val= self.eval(contents)
	console.log("*",filename,contents,val)
	return val
}
TrueModule.resolver= resolve.sync
TrueModule.read= fs.readFileSync
TrueModule.eval= eval
