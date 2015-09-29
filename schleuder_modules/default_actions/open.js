/*global Buffer */

var fs = require('fs');
var http = require('http');
var url = require('url');
var buffer = require('buffer');

var lwip = require('lwip');
var q = require('q');
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

var open = function(schleuderAction){

	var deferred = q.defer();	

	var options = getRequestOptions(schleuderAction.getImageUrl());

	var req = http.request(options, function(res) {

		var data = [];

		res.on('data', function (chunk) {

			data.push(chunk);

		});

		res.on('end', function() {

			var imageBuffer = Buffer.concat(data);
			
			var type = fileType(imageBuffer);
			schleuderAction.setMimeType(type.mime);

			if(undefined === schleuderAction.getFormat()){
				deferred.reject();
			}

			lwip.open(imageBuffer, schleuderAction.getFormat(), function(error, image){
				schleuderAction.setOrginalImage(image);
				deferred.resolve(schleuderAction);	
			});

		});
	});

	req.on('error', function(e) {
	  deferred.reject(e.message);
	});

	req.end();

	return deferred.promise;	


};

module.exports = open;
