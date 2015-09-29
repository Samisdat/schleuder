var express = require('express');
var router = express.Router();

var lwip = require('lwip');

var schleuder = require('../schleuder_modules/schleuder');

router.get('/local-image', function(req, res, next) {
  
  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

  	res.sendFile(filename);

});

router.get('^/:action//*//:image$', schleuder);

module.exports = router;
