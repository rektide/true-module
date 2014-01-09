var fs= require("fs"),
  resolve= require("resolve")

module.exports= TrueModule

/**
  True-Module
*/

function TrueModule(name){
	var self= this||TrueModule
	var filename= self.resolver(name)
	var contents= self.read(filename)
	var val= self.eval(contents)
	return val
}
TrueModule.resolver= function(moduleName){
	var resolved= moduleName
	// TODO: resolve mdule name
	return resolved
}

TrueModule.read= fs.readFileSync

TrueModule.eval= eval
