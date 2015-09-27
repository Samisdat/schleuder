var lwip = require('lwip');
var q = require('q');
var fs = require('fs');
var http = require('http');
var url = require('url');
require('buffer');


var fileType = require('file-type');

var getRequestOptions = function(imageUrl){
	var options = {
	  hostname: undefined,
	  port: undefined,
	  path: undefined,
	  method: 'GET'
	};

	var urlParsed = url.parse(imageUrl);

	if(urlParsed.protocol === 'http:'){
		options.port = 80;
	}
	else if(urlParsed.protocol === 'https:'){
		options.port = 443;
	}

	options.hostname = urlParsed.hostname; 
	options.path = urlParsed.path; 

	return options;

};

var openRemote = function(imageUrl){

	var deferred = q.defer();	

	var options = getRequestOptions(imageUrl);

	var req = http.request(options, function(res) {

		var data = [];

		res.on('data', function (chunk) {

			data.push(chunk)

		});

		res.on('end', function() {

			var buffer = Buffer.concat(data);
			
			var type = fileType(buffer);
			var format = false;

			if('image/png' === type.mime){
				format = 'png';
			}
			else if('image/jpeg' === type.mime){
				format = 'jpg';				
			}

			if(false === format){
				deferred.reject();
			}

			lwip.open(buffer, format, function(error, image){
				console.log(image.width())
				deferred.resolve(image);	
			});

		});
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.end();

	return deferred.promise;	
};


module.exports = openRemote;
