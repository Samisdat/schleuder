var lwip = require('lwip');
var q = require('q');
var fs = require('fs');
var http = require('http');
require('buffer');

var openLocal = function(filename){
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

var openRemote = function(filename){

	var deferred = q.defer();	


	fs.readFile(filename, function(error, fsBuffer){
		if(error){
			deferred.reject();
		}


		var options = {
		  hostname: '3.f.ix.de',
		  port: 80,
		  path: '/scale/geometry/600/q75/imgs/18/1/4/5/3/3/9/9/16249197804_1806b101a2_k-89f4f4dd5091b029.jpeg',
		  method: 'GET',
		};

		var req = http.request(options, function(res) {

			var data = [];


			var body;
		  

		  res.on('data', function (chunk) {
		    body += chunk

		    data.push(chunk)

		  });
		  res.on('end', function() {

				var buffer = Buffer.concat(data);
				console.log(buffer)

		  		lwip.open(buffer, 'jpg', function(error, image){
		  			console.log(error)
		  			console.log(image)
		  			deferred.resolve(image);	
				});


		  })
		});

		req.on('error', function(e) {
			console.log(e);
		  console.log('problem with request: ' + e.message);
		});

		req.end();
	});


	return deferred.promise;	

	http.get(filename).on('response', function (response) {
		res.setEncoding('binary');
    	var body = '';
    
    	response.on('data', function (chunk) {
        	body += chunk;
    	});
    	response.on('end', function () {
			console.log(body)
	  		lwip.open(body, 'jpg', function(error, image){
	  			console.log(error)
	  			console.log(image)
	  			//deferred.resolve(image);	
			});
		});
	});

	return deferred.promise;	
};


module.exports = openRemote;
