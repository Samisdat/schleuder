var remoteImage = require('../schleuder_modules/image');

var open = require('../schleuder_modules/default_actions/open');

var resize = require('../schleuder_modules/actions/resize');
var scale = require('../schleuder_modules/actions/scale');
var rotate = require('../schleuder_modules/actions/flip');

var send = require('../schleuder_modules/default_actions/send');

var schleuder = function(request, response, next){

	var getImageUrl = function(){
		if('/foo' === request.path){
			return 'http://3.f.ix.de/scale/geometry/600/q75/imgs/18/1/4/5/3/3/9/9/16249197804_1806b101a2_k-89f4f4dd5091b029.jpeg';
		}
		if('/foobar' === request.path){
			return 'http://vignette3.wikia.nocookie.net/callofduty/images/c/cf/Facebook_like_buton.png';
		}
	};

	var actions = {
		resize:{
			width:100,
			height:100
		},
		flip:{
			axis: 'x'
		}
	};

    //open(getImageUrl())
	//.then(rotate)
  	//
  	remoteImage(getImageUrl())
	.then(resize)
  	.then(function(lwipImage){

      lwipImage.getLwip().toBuffer(lwipImage.getFormat(), {quality:100}, function(err, buffer){
        response.contentType(
        	lwipImage.getMimeType()
    	);
        response.send(buffer);
      });   
  });




};

module.exports = schleuder;
