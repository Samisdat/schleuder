var q = require('q');

var open = require('../schleuder_modules/default_actions/open');

var resize = require('../schleuder_modules/actions/resize');
var scale = require('../schleuder_modules/actions/scale');
var rotate = require('../schleuder_modules/actions/flip');

var send = require('../schleuder_modules/default_actions/send');
var cache = require('../schleuder_modules/default_actions/cache');

var action = require('../schleuder_modules/action.js');

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

var schleuder = function(request, response, next){

	
	var cached = cache.from(request.path).then(function(cacheBuffer){
		var type = fileType(cacheBuffer);

		console.log(type)
  		response.contentType(
        	type.mime
    	);
        response.setHeader("x-cached", "yes");
		response.send(cacheBuffer);

	}).fail(function(){
	
	var imageUrl = getImageUrl(request);
	var actionName = request.params.action;
	var actionParams = getActionParameters(request);

	var imageAction = action(request, response, imageUrl, actionName, actionParams);

  	open(imageAction)
	.then(resize)
  	.then(send)
  	.then(function(schleuderAction){
      schleuderAction.getActualImage().toBuffer(schleuderAction.getFormat(), {quality:100}, function(err, buffer){
        toCache(request.path, buffer);
      });   
  });

	});
	

	


};

module.exports = schleuder;
