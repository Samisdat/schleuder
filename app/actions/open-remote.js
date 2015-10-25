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

var open = function(image){

	var deferred = q.defer();

	var options = getRequestOptions(image.getImageUrl());

	var req = http.request(options, function(res) {

		var data = [];

		res.on('data', function (chunk) {

			data.push(chunk);

		});

		res.on('end', function() {

			var imageBuffer = Buffer.concat(data);

			var type = fileType(imageBuffer);

            var openImage = new Image();

            openImage.onerror = function() {
                deferred.reject();
            };

            openImage.onload = function() {
                var width = openImage.width;
                var height = openImage.height;

                var canvas = new Canvas(width, height);
                var ctx = canvas.getContext('2d');

                ctx.drawImage(openImage, 0, 0, width, height);

                image.setCtx(ctx);
                image.setOrginalWidth(width);
                image.setOrginalHeight(height);
                image.setWidth(width);
                image.setHeight(height);

                image.setMimeType(type.mime);

                deferred.resolve(image);

            };

            openImage.src = imageBuffer;

        });
	});

	req.on('error', function(e) {
	  deferred.reject(e.message);
	});

	req.end();

	return deferred.promise;


};

module.exports = open;
