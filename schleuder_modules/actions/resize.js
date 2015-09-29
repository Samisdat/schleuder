var lwip = require('lwip');
var q = require('q');

var resize = function(schleuderAction){

	var deferred = q.defer();


	var width;
	var height;

	var actionParams = schleuderAction.getActionParams();

	if(undefined !== actionParams.width){
		width = parseInt(actionParams.width, 10);
	}
	if(undefined !== actionParams.height){
		height = parseInt(actionParams.height, 10);
	}

	if(undefined === width && undefined === height){
		deferred.reject();
	}
	else{

		if(undefined === height){
			height = Math.ceil(width / schleuderAction.getRatio());
		}
		else if(undefined === width){
			width = Math.ceil(height * schleuderAction.getRatio());
		}

		schleuderAction.getActualImage().resize(width, height, 'lanczos', function(error, image){

			if(error){
				deferred.reject();
			}
			else{

				schleuderAction.setActualImage(image);
				deferred.resolve(schleuderAction);
			}

		});

	}


	return deferred.promise;
};

module.exports = resize;
