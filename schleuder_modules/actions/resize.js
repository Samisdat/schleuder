var lwip = require('lwip');
var q = require('q');

var resize = function(image){

	var deferred = q.defer();

	image.resize(100, 200, 'lanczos', function(error, img){

		if(error){
			deferred.reject();
		}
		else{
			deferred.resolve(img);
		}

	});

	return deferred.promise;
};

module.exports = resize;
