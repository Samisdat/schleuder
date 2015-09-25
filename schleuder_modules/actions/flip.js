var lwip = require('lwip');
var q = require('q');

var flip = function(image){

	var deferred = q.defer();

	image.mirror('x', function(error, img){

		if(error){
			deferred.reject();
		}
		else{
			deferred.resolve(img);
		}

	});

	return deferred.promise;
};

module.exports = flip;
