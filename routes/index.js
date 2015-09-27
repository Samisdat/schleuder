var express = require('express');
var router = express.Router();

var lwip = require('lwip');

var open = require('../schleuder_modules/actions/open');
var resize = require('../schleuder_modules/actions/resize');
var scale = require('../schleuder_modules/actions/scale');
var rotate = require('../schleuder_modules/actions/flip');
var send = require('../schleuder_modules/actions/send');

router.get('/local-image', function(req, res, next) {
  
  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

  	res.sendFile(filename);

});

/* 
router.get('/', function(req, res, next) {
  
  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

  open(filename)
  .then(rotate)
  .then(resize)
  .then(function(image){
      image.toBuffer('jpeg', {quality:100}, function(err, buffer){
      	res.contentType('image/jpeg');
      	res.send(buffer);
      });  	
  });

});

*/
router.get('/', function(request, response, next){
    var imageUrl = '/var/www/schleuder/raw-images/moon.jpeg';

    open(imageUrl)
    .then(rotate)
  .then(resize)
  .then(function(image){
      image.toBuffer('jpeg', {quality:100}, function(err, buffer){
        response.contentType('image/jpeg');
        response.send(buffer);
      });   
  });

});

module.exports = router;
