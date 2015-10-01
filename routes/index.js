
var express = require('express');
var router = express.Router();

var lwip = require('lwip');

var schleuder = require('../schleuder_modules/schleuder');

router.get('/local-image', function(req, res, next) {
  
  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

  	res.sendFile(filename);

});

router.get('^/:action//*//:image$', schleuder);

var action = require('../schleuder_modules/action.js');
var open = require('../schleuder_modules/default_actions/open');
var seamCarver = require('../schleuder_modules/actions/seamcarver');
var send = require('../schleuder_modules/default_actions/send');

var lwip = require('lwip');
router.get('^/seam$', function(request, response){

	lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(err, image){


		seamCarver(image);

	});

});


module.exports = router;
