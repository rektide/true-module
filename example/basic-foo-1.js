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
		return Q.all(then.map(fn))
	}
}
(function(){
	var q= Q()
	q.constructor.prototype.map= function(fn){
		return this.then(map(fn))
	}
})()

// spit out errors
process.on("uncaughtException",console.log)

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


//// EXECUTE

// resolve modules by true-module

var jss= jsFilenames.map(require)
jss.fail(console.log)

// and resolve expected-outputs by read/eval
function readSync(n){
	return io.read(n)
}
function evalSync(n){
	return eval("("+n+")")
}
var outs= outFilenames.map(readSync).map(evalSync)
outs.fail(console.log)


// CHECK RESULTS

// check results
var ok= Q.spread([jss,outs],function(a,b){
	//console.log("have",a,b)
	a.map(function(got,i){
		var expected= b[i]
		assert(got,expected)
	})
	console.log(a)
})
ok.fail(console.log)
