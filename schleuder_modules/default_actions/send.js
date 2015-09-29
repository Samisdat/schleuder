var q = require('q');

var send = function(schleuderAction){

	var deferred = q.defer();	

	schleuderAction.getActualImage().toBuffer(schleuderAction.getFormat(), {quality:100}, function(err, buffer){

		schleuderAction.getResponse().contentType(
			schleuderAction.getMimeType()
		);
		schleuderAction.getResponse().send(buffer);

	});   

	return deferred.promise;	

};

module.exports = send;
