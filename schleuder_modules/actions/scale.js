var lwip = require('lwip');
var q = require('q');

var scale = function(image){

	var deferred = q.defer();

	image.scale(0.5, function(error, img){

		if(error){
			deferred.reject();
		}
		else{
			deferred.resolve(img);
		}

	});

	return deferred.promise;
};

module.exports = scale;
