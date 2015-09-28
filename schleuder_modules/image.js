var fs = require('fs');
var http = require('http');
var url = require('url');
var buffer = require('buffer');
var lwip = require('lwip');
var q = require('q');


var fileType = require('file-type');

/**
 * Lwip has no method to get mimetype, but needs the type a.k.a. format e.g. to write to file
 * So wrap lwip  
 */
var lwipImage = function(mimeType, lwipImage){

	console.log('mimeType', mimeType)
	console.log('lwipImage', lwipImage)

	var width = 0;
	var height = 0;
	var ratio = 0;

	/* Getter / Setter */
	var getMimeType = function(){
		return mimeType
	};

	var getFormat = function(){
		if('image/png' === mimeType){
			return 'png';
		}
		else if('image/jpeg' === mimeType){
			return 'jpg';				
		}
	};

	var updateLwip = function(_lwipImage){
		lwipImage = lwipImage;
	};
	var getLwip = function(){
		return lwipImage;
	};
	var getWidth = function(){
		return lwipImage.width();
	};
	var getHeight = function(){
		return lwipImage.height();
	};
	var getRatio = function(){
		return getWidth() / getHeight() ;
	};

	return{
		getMimeType: getMimeType, 
		getFormat: getFormat,
		getLwip: getLwip,
		updateLwip: updateLwip, 
		getWidth: getWidth, 
		getHeight: getHeight,
		getRatio: getRatio
	};

};

	/* \ Getter / Setter */
var remoteImage = function(imageUrl){

	var deferred = q.defer();	


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



	var options = getRequestOptions(imageUrl);

	var req = http.request(options, function(res) {

		var data = [];

		res.on('data', function (chunk) {

			data.push(chunk)

		});

		res.on('end', function() {

			var imageBuffer = Buffer.concat(data);
			
			var type = fileType(imageBuffer);
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

			lwip.open(imageBuffer, format, function(error, image){
				deferred.resolve(lwipImage(type.mime, image));	
			});

		});
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.end();

	return deferred.promise;	


};

module.exports = remoteImage;
