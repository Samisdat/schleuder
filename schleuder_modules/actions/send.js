var q = require('q');

var send = function(req, res, image){
      image.toBuffer('jpeg', {quality:1}, function(err, buffer){
      	res.contentType('image/jpeg');
      	res.send(buffer);
      });

};

module.exports = send;
