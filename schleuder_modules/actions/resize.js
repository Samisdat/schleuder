var lwip = require('lwip');
var q = require('q');

var resize = function(lwipImage){

	var deferred = q.defer();

	lwipImage.getLwip()	.resize(100, 200, 'lanczos', function(error, img){

		if(error){
			deferred.reject();
		}
		else{
			lwipImage.updateLwip(img);
			deferred.resolve(lwipImage);
		}

	});

	return deferred.promise;
};

module.exports = resize;
