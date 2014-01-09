var assert= require("assert"), 
  Q= require("q"),
  io= require("q-io/fs"),
  util= require("util")

//// PREP RUNTIME

// install true-module
var require= require("../true-module")(module)

// monkey patch "map" onto Q
function map(fn){
	return function(then){
		var val= then.map(fn)
		console.log("m",util.inspect(then),util.inspect(val),fn)
		return Q.all(val)
	}
}
(function(){
	var q= Q()
	q.constructor.prototype.map= function(fn){
		return this.then(map(fn))
	}
})()

// spit out errors
//process.on("uncaughtException",console.log.bind(console))

//// PREP TESTS

// lookup all foo/*js filenames
var guard= /\.js$/
function fileGuard(path,stat){
	var val= guard.test(path)
	return val
}
function concatLocal(path){
	return "./"+path
}
var jsFilenames= io.listTree("./foo",fileGuard).map(concatLocal)


// concat .out for output filenames
function addOut(i){
	return i+".out"
}
var outFilenames= jsFilenames.map(addOut)
//outFilenames.then(function(t){console.log("t",t)})


//// EXECUTE

// resolve files
var jss= jsFilenames.map(require)
//jss.then(function(a){console.log("a",util.inspect(a))})
//jss.fail(console.log.bind(console))

var outs= outFilenames.map(io.read.bind(io)).map(JSON.parse)
//outs.then(function(b){console.log("b",util.inspect(b))})
//outs.fail(console.log.bind(console))


// CHECK RESULTS

// check results
Q.all([jss,outs]).then(function(a,b){
	console.log("have-a",a)
	console.log("have-b",b)
	a.map(function(got,i){
		var expected= b[i]
		if(got != b[i])
			throw "Unexpected "+got+" found in input "+jsFilenames[i]+"; expected: "+expected
		console.log("ok ",val)
	})
})
