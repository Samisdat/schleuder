var remoteImage = require('../schleuder_modules/image');

var open = require('../schleuder_modules/default_actions/open');

var resize = require('../schleuder_modules/actions/resize');
var scale = require('../schleuder_modules/actions/scale');
var rotate = require('../schleuder_modules/actions/flip');

var send = require('../schleuder_modules/default_actions/send');

var action = require('../schleuder_modules/action.js');


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
      });   
  });



};

module.exports = schleuder;
