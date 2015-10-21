/*global Buffer */

var fs = require('fs');
var http = require('http');
var url = require('url');
var buffer = require('buffer');

var q = require('q');
var fileType = require('file-type');
var Canvas = require('canvas');
var Image = Canvas.Image;


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

var open = function(url){

	var deferred = q.defer();

	var options = getRequestOptions(url);

	var req = http.request(options, function(res) {

		var data = [];

		res.on('data', function (chunk) {

			data.push(chunk);

		});

		res.on('end', function() {

			var imageBuffer = Buffer.concat(data);

			var type = fileType(imageBuffer);

            var image = new Image();

            image.onerror = function() {
                deferred.reject();
            };

            image.onload = function() {
                var width = image.width;
                var height = image.height;

                var canvas = new Canvas(width, height);
                var ctx = canvas.getContext('2d');

                ctx.drawImage(image, 0, 0, width, height);

                deferred.resolve({
                    width:width,
                    height:height,
                    mime:type.mime,
                    ctx:ctx
                });

            };

            image.src = imageBuffer;

        });
	});

	req.on('error', function(e) {
	  deferred.reject(e.message);
	});

	req.end();

	return deferred.promise;


};

module.exports = open;
