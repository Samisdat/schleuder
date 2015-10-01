var lwip = require('lwip');
var q = require('q');

var flip = function(schleuderAction){

	var deferred = q.defer();

	schleuderAction.getActualImage().mirror('x', function(error, image){

		if(error){
			deferred.reject();
		}
		else{
			schleuderAction.setActualImage(image);
			deferred.resolve(schleuderAction);
		}

	});

	return deferred.promise;
};

module.exports = flip;
