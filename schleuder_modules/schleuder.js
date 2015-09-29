var q = require('q');

var remoteImage = require('../schleuder_modules/image');

var open = require('../schleuder_modules/default_actions/open');

var resize = require('../schleuder_modules/actions/resize');
var scale = require('../schleuder_modules/actions/scale');
var rotate = require('../schleuder_modules/actions/flip');

var send = require('../schleuder_modules/default_actions/send');

var action = require('../schleuder_modules/action.js');

var crypto = require('crypto');
var fs = require('fs');

var fileType = require('file-type');

var getImageUrl = function(request){

	var domain = 'http://schleuder.dev.pertz.eu';
	request.params.image = 'local-image';

	var imageUrl = domain + '/' + request.params.image;

	return imageUrl;
};

var getActionParameters = function(request){

	var actionParams = {};

	if(0 === request.params.length){
		return actionParams;
	}

	var rawActionParams = request.params[0];	

	rawActionParams = rawActionParams.split('/');

	for(var i = 0, x = rawActionParams.length; i < x; i += 2){
		actionParams[rawActionParams[i]] = rawActionParams[(i + 1)]; 
	}

	return actionParams;

};

var fromCache = function(request){

	var deferred = q.defer();	

	var hash = crypto.createHash('sha1');
	hash.update(request.path);
	
	var requestHash = hash.digest('hex');
	var cacheFile = __dirname + '/../cache/' + requestHash;

	fs.readFile(cacheFile, function (err, data) {
  		if (err){
  			deferred.reject();
  		} 
  		deferred.resolve(data);
	});

	return deferred.promise;	

};

var toCache = function(request, buffer){
	var deferred = q.defer();	

	var hash = crypto.createHash('sha1');
	hash.update(request.path);
	
	var requestHash = hash.digest('hex');
	var cacheFile = __dirname + '/../cache/' + requestHash;

	fs.writeFile(cacheFile, buffer,  'binary',  function (err, data) {
  		if (err){
  			deferred.reject();
  		} 
  		deferred.resolve(data);
	});

	return deferred.promise;	

};

var schleuder = function(request, response, next){

	/*
	var cached = fromCache(request).then(function(cacheBuffer){
		var type = fileType(cacheBuffer);

		console.log(type)
  		response.contentType(
        	type.mime
    	);
        response.setHeader("x-cached", "yes");
		response.send(cacheBuffer);
	
		return;

	});
	*/

	var imageUrl = getImageUrl(request);
	var actionName = request.params.action;
	var actionParams = getActionParameters(request);


	var imageAction = action(imageUrl, actionName, actionParams);

  	remoteImage(imageAction)
	.then(resize)
  	.then(function(schleuderAction){

      schleuderAction.getActualImage().toBuffer(schleuderAction.getFormat(), {quality:100}, function(err, buffer){
        response.contentType(
        	schleuderAction.getMimeType()
    	);
        response.send(buffer);
        toCache(request, buffer);
      });   
  });



};

module.exports = schleuder;
