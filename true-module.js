var fs= require("fs"),
  path= require("path"),
  resolve= require("resolve")

function resolveSync(name){
	return resolve.sync(name,this)
}

function readSync(filename){
	return "("+fs.readFileSync(filename,"utf8")+")"
}


module.exports= function(module){
	function TrueModule(name){
		var self= this==global?TrueModule:this,
		  val
		var filename= self.resolver(name)
		var contents= self.read(filename)
		val= self.eval(contents)
		return val
	}
	TrueModule.basedir= path.dirname(module.filename)
	TrueModule.resolver= resolveSync
	TrueModule.read= readSync
	TrueModule.eval= eval
	return TrueModule
}
