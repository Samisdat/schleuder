var q = require('q');

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
	    for (var x = 0; width = image.width(); x < width;  x += 1) {
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
	            heatMap[yseam[x][y]][y] = NaN;
	        }
	    }
	    
	    console.log("Seams calculated");
	    seams = yseam;


    };

    initSeams();

    var getHeatMap = function(){

    };

    var getSeams = function(){

    };

    var resize = function(dim){

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
