var assert= require("assert"), 
  Q= require("q"),
  io= require("q-io/fs"),
  require= require("../true-module")

// lookup all foo/*js filenames
var guard= /\.js$/
function fileGuard(path,stat){
	return good.match(path)
}
var jsFilenames= io.listTree("./foo",fileGuard)

// concat .out for output filenames
function map(fn){
	return function(then){
		return Q.all(then.map(fn))
	}
}
Q.prototype.map= map
function addOut(i){
	return i+".out"
}
var outFilenames= jsFilenames.map(addOut)

// resolve files
var jss= jsFilenames.map(require),
  outs= outFilesnames.map(io.read).map(JSON.parse)

// check results
function ok(a,b){
	return 
}

Q.all([jss,outs]).then(function(a,b){
	a.map(function(got,i){
		var expected= b[i]
		if(got != b[i])
			throw "Unexpected "+got+" found in input "+jsFilesnames[i]+"; expected: "+expected
	})
})
