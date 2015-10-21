
var express = require('express');
var router = express.Router();

var lwip = require('lwip');

var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs');

    var LiquidScaling = require('../app/liquid-scaling/index');


var schleuder = require('../schleuder_modules/schleuder');

router.get('/local-image', function(req, res, next) {

  var filename = '/var/www/schleuder/raw-images/kitty.jpg';

  	res.sendFile(filename);

});

router.get('/liquid-image', function(req, res, next) {


    var img = new Image
      , start = new Date;

    img.onerror = function(err){
      throw err;
    };

    img.onload = function(){
      var width = img.width;
      var height = img.height;
      var canvas = new Canvas(width, height);
      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, width, height);

      var liquidScaling = new LiquidScaling(ctx);
      var heatMapCtx = liquidScaling.resize(800);

      heatMapCtx.canvas.toBuffer(function(err, buf){
        fs.writeFile(__dirname + '/../public/seamcarver/redo.jpg', buf, function(){
          console.log('Resized and saved in %dms', new Date - start);

          res.sendFile('/var/www/schleuder/public/seamcarver/redo.jpg');
        });
      });

    }


    //img.src = __dirname + '/raw-images/laterne.jpg';
    //img.src = __dirname + '/public/seamcarver/ballon.jpg';
    //img.src = __dirname + '/public/seamcarver/habor.jpg';
    //img.src = __dirname + '/public/seamcarver/65435387.jpg';
    img.src = __dirname + '/../raw-images/skyline.jpg';

    //img.src = '/var/www/schleuder/raw-images/kitty.jpg';



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
