var seamCarver = require('./schleuder_modules/actions/seamcarver');
var lwip = require('lwip');

/*
lwip.create(100, 100, {r:0, g:0, b:0}, function(err, blankImage){

	var x = 0;
	var y = 0;

	var nextPixel = function(){
		x += 1;

		if(blankImage.width() >= x){
			x = 0;
			y += 1;
		}

		if(blankImage.height() >= y){
			return false;
		}

		return true;
	};

	var colorPixel = function(){
		blankImage.setPixel(x, y, 'black', function(){
			var hasNext = nextPixel();
			if(true === hasNext){
				colorPixel();
			}
			else{
				blankImage.writeFile('/var/www/schleuder/raw-images/bpe.jpg', 'jpg', {quality:100}, function(){});
			}
		});
	};

	colorPixel();

     
    

});

*/

lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(err, image){

	var carved = seamCarver(image);

	//carved.resize({width:400, height:500});
	carved.getHeatMap();

});
