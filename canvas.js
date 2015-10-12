/**
 * Module dependencies.
 */

var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs');

var seamCarver = require('./app/seamcarver');
  
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
  var carved = seamCarver(canvas, ctx);
  //carved.getHeatMap();
  carved.getSeams();
  return;
  console.log(canvas.height)
  
  
  ctx.imageSmoothingEnabled = true;

  var c = ctx.getImageData(0, 0, 1, 1).data;
  console.log(c);
  canvas.toBuffer(function(err, buf){
    fs.writeFile(__dirname + '/resize.jpg', buf, function(){
      console.log('Resized and saved in %dms', new Date - start);
    });
  });
  
}  


img.src = __dirname + '/raw-images/ballon.jpg';

