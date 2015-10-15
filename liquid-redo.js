/**
 * Module dependencies.
 */

var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs');

var LiquidScaling = require('./app/liquid-scaling/index');

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
  var heatMapCtx = liquidScaling.resize(290);


  heatMapCtx.canvas.toBuffer(function(err, buf){
    fs.writeFile(__dirname + '/public/seamcarver/redo.jpg', buf, function(){
      console.log('Resized and saved in %dms', new Date - start);
    });
  });

}


//img.src = __dirname + '/raw-images/laterne.jpg';
//img.src = __dirname + '/public/seamcarver/ballon.jpg';
//img.src = __dirname + '/public/seamcarver/habor.jpg';
//img.src = __dirname + '/public/seamcarver/65435387.jpg';
img.src = __dirname + '/public/seamcarver/ballon.jpg';
