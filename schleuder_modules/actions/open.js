var lwip = require('lwip');
var q = require('q');
var fs = require('fs');

var open = function(filename){
	var deferred = q.defer();

	fs.readFile(filename, function(error, buffer){
		if(error){
			deferred.reject();
		}

  		lwip.open(buffer, 'jpg', function(err, image){
  			deferred.resolve(image);	
		});
	});

	return deferred.promise;
};

module.exports = open;
