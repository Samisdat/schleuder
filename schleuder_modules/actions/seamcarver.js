var q = require('q');
var lwip = require('lwip');

var pixel = function(red, green, blue, alpha){
	return{
		red: red, 
		green: green,
		blue: blue,
		alpha: alpha
	};
};

var seamCarver = function(lwipImage){

    var image = lwipImage;
    var newImage = [];

    var maxHeat;
    var heatMap;

    var seams;

    var pixels = []

    var getPixel = function(x, y){
    	//@TODO Validate params
    	return pixels[x][y];
    };

    var setPixels = function(){
		for (var x = 0, width = image.width(); x < width;  x += 1) {
			pixels[x] = [];
			for (var y = 0, height = image.height(); y < height;  y += 1) {
					pixels[x][y] = image.getPixel(x, y);
			}

		}
    }
	setPixels();

    var putPixel = function(x, y, color){

    };

    var copyImage = function(){
    	lwip.create(image.width(), image.height(), {r:0, g:0, b:0, a:0}, function(err, image){

    	});
    };

    var initHeatMap = function(){
    	console.log("Starting to calculate heatmap");


	    var b = function(x, y){
	        if (x < 0 || y < 0 || x >= image.width() || y >= image.height()) {
	            return 0;
	        }
	        var pixel = getPixel(x, y);
	        return (pixel.r + pixel.g + pixel.b);
	    }

	    heatMap = [];
	    var max = 0;
	    for (var x = 0, width = image.width(); x < width;  x += 1) {
	        heatMap[x] = [];
	        for (var y = 0; y < image.height(); y++) {
	            var xenergy = b(x - 1, y - 1) + 2 * b(x - 1, y) + b(x - 1, y + 1) - b(x + 1, y - 1) - 2 * b(x + 1, y) - b(x + 1, y + 1)
	            var yenergy = b(x - 1, y - 1) + 2 * b(x, y - 1) + b(x + 1, y - 1) - b(x - 1, y + 1) - 2 * b(x, y + 1) - b(x + 1, y + 1)
	            heatMap[x][y] = Math.sqrt(xenergy * xenergy + yenergy * yenergy);
	            max = (max > heatMap[x][y] ? max : heatMap[x][y]);
	        }
	    }
	    maxHeat = max;
    };

    var initSeams = function(){
	    var yseam = [];

	    if(undefined === heatMap){
	    	initHeatMap();
	    }

	    var ylen = image.height() - 1;
	    // initialize the last row of the seams
	    for (var x = 0; x < image.width(); x++) {
	        yseam[x] = [];
	        yseam[x][ylen] = x;
	    }
	    
	    // sort the last row of the seams
	    for (var i = 0; i < yseam.length; i++) {
	        for (var j = i + 1; j < yseam.length; j++) {
	            if (heatMap[yseam[i][ylen]][ylen] > heatMap[yseam[j][ylen]][ylen]) {
	                var tmp = yseam[j];
	                yseam[j] = yseam[i]
	                yseam[i] = tmp;
	            }
	        }
	    }
	    
	    // get the other rows of the seams
	    for (var x = 0; x < yseam.length; x++) {
	        for (var y = ylen - 1; y >= 0; y--) {
	            var x1 = yseam[x][y + 1];
	            var x0 = x1 - 1;
	            // Move along till the adjacent pixel is not a part of another seam
	            while (x0 >= 0) {
	                if (!isNaN(heatMap[x0][y])) 
	                    break;
	                x0--;
	            }
	            
	            var x2 = x1 + 1;
	            while (x2 < image.width()) {
	                if (!isNaN(heatMap[x2][y])) 
	                    break;
	                x2++;
	            }
	            
	            var hx0 = heatMap[x0] ? heatMap[x0][y] : Number.MAX_VALUE;
	            var hx1 = heatMap[x1][y] || Number.MAX_VALUE;
	            var hx2 = heatMap[x2] ? heatMap[x2][y] : Number.MAX_VALUE;
	            
	            // Choose the least energy
	            yseam[x][y] = hx0 < hx1 ? (hx0 < hx2 ? x0 : x2) : (hx1 < hx2 ? x1 : x2);
	            //heatMap[yseam[x][y]][y] = NaN;
	        }
	    }
	    
	    console.log("Seams calculated");
	    seams = yseam;


    };

    initSeams();

    var getHeatMap = function(){

	    if(undefined === heatMap){
	    	initHeatMap();
	    }

		lwip.create(image.width(), image.height(), {r:0, g:0, b:0}, function(err, blankImage){

			var batch = blankImage.batch();

			for (var x = 0; x < blankImage.width(); x++) {
		    	for (var y = 0; y < blankImage.height(); y++) {
					var color = parseInt(heatMap[x][y] / maxHeat * 255, 10);
				
					batch.setPixel(x, y, {r:color, g:color, b:color});
	
		        }
		    }
	    	    
			batch.writeFile('/var/www/schleuder/raw-images/heatmap.jpg', 'jpg', {quality:100}, function(){});

		});

    };

    var getSeams = function(){

    };

    var resize = function(dim){

	    if(undefined === seams){
	    	initSeams();
	    }
	    console.log("Starting resize Reduce");
	    
	    newImage = [];
	    var widthDiff = image.width() - dim.width;
	    console.log("Removing Seams");
	    for (var y = 0; y < image.height(); y++) {
	        var x1 = 0; // x counter of the new image
	        for (var x = 0; x < image.width(); x++) {
	            putPixel(x, y, getPixel(x, y));
	            var isSkippable = false;
	            for (var i = 0; i < widthDiff; i++) {
	                if (seams[i][y] == x) {
	                    isSkippable = true;
	                    console.log(isSkippable);
	                    break;
	                }
	            }
	            if (isSkippable == false) {
	                putPixel(x1, y, getPixel(x, y));
	                x1++;
	            }
	        }
	    }
	    console.log("Seams removed, placing empty pixels in reduced portion of image");
	    return;
	    for (var x = dim.width; x < image.width(); x++) {
	        for (var y = 0; y < image.height(); y++) {
	            putPixel(x, y, 0xABCDEF);
	        }
	    }
	    console.log("Reduced image ready");


    };

    return {
    	getHeatMap: getHeatMap,
    	resize:resize
    };
};

var seamCarverAction = function(schleuderAction){

	var deferred = q.defer();

	var carved = seamCarver(schleuderAction.getActualImage());
	
	schleuderAction.getActualImage().mirror('y', function(error, image){

		if(error){
			deferred.reject();
		}
		else{
			schleuderAction.setActualImage(image);
			deferred.resolve(schleuderAction);
		}

	});

	return deferred.promise;
};

module.exports = seamCarver;
