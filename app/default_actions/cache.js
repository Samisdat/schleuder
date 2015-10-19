/*global __dirname */

var crypto = require('crypto');
var fs = require('fs');

var q = require('q');

/**
 * @TODO While all other actions get schleuderAction and cache is not compalitble
 * MayBe cache should be method of schleuderAction or schleuder
 * Or better: make read from cache an own route and when not cached: next()
 */

var getRequestHash = function(requestPath){

	var hash = crypto.createHash('sha1');
	hash.update(requestPath);
	
	return hash.digest('hex');

};

var getCacheFileName = function(requestPath){

	var requestHash = getRequestHash(requestPath);

	return __dirname + '/../../cache/' + requestHash;

};



var from = function(requestPath){

	var deferred = q.defer();	

	var cacheFile = getCacheFileName(requestPath);

	fs.readFile(cacheFile, function (err, data) {

	  		if (err){
  			deferred.reject();
  		} 
  		deferred.resolve(data);
	});

	return deferred.promise;	

};

var to = function(requestPath, buffer){
	var deferred = q.defer();	

	var cacheFile = getCacheFileName(requestPath);
	
	fs.writeFile(cacheFile, buffer,  'binary',  function (err, data) {
  		if (err){
  			deferred.reject();
  		} 
  		deferred.resolve(data);
	});

	return deferred.promise;	

};

module.exports = {
	from:from,
	to:to
};