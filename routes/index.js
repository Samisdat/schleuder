var express = require('express');
var router = express.Router();

var fs = require('fs');
var lwip = require('lwip');

var open = require('../actions/open');
var scale = require('../actions/scale');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

fs.readFile(filename, function(err, buffer){
  // check err
  lwip.open(buffer, 'jpg', function(err, image){
      // check 'err'. use 'image'.
      // image.resize(...), etc.
      image.toBuffer('jpeg', {quality:1}, function(err, buffer){
      	res.contentType('image/jpeg');
      	res.send(buffer);
      });
  });
});

return;
/*
	lwip.open(filename, function(error, image){
		if(error){
			return;
		}
		console.log(image)
// check err...
  // manipulate image:
  image.scale(1.2, function(err, image){
  	image.writeFile('/var/www/schleuder/raw-images/kitty2.jpg', 'jpg', {}, function(){
  		res.sendFile('/var/www/schleuder/raw-images/kitty2.jpg');
  	});
        

});



	});
return;
*/

  open(fileName)
  .then(function(image){
		image.scale(0.5, function(error, image){
		res.send(image);
		
	});


  })
  .then(function(image){
  	
})
  ;


  return;



  // check err...
  // manipulate image:
  image.scale(1.2, function(err, image){
  	image.writeFile('/var/www/schleuder/raw-images/kitty2.jpg', 'jpg', {}, function(){
  		res.sendFile('/var/www/schleuder/raw-images/kitty2.jpg');
  	});
        

});
	

});

module.exports = router;
