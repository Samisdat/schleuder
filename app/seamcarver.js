var lwip = require('lwip');

var seamCarver = function(lwipImage){

    var width = lwipImage.width();
    var height = lwipImage.height();

    var pixels = []

    var getWidth = function(){
        return width;
    };

    var getHeight = function(){
        return height;
    };

    var setPixels = function(){
        for (var x = 0, width = getWidth(); x < width;  x += 1) {
            pixels[x] = [];
            for (var y = 0, height = getHeight(); y < height;  y += 1) {
                    pixels[x][y] = lwipImage.getPixel(x, y);
            }

        }
    }
    setPixels();

    var getPixel = function(x, y){
        //@TODO Validate params
        return pixels[x][y];
    };

    var putPixel = function(x, y, color){

    };

    var copyImage = function(){

    };

    var initHeatMap = function(){
        var b = function(x, y){
            if (x < 0 || y < 0 || x >= getWidth() || y >= getHeight()) {
                return 0;
            }
            var pixel = getPixel(x, y);
            return (pixel.r + pixel.g + pixel.b);
        }

        var heatMap = [];
        var max = 0;
        for (var x = 0, width = getWidth(); x < width;  x += 1) {
            heatMap[x] = [];
            for (var y = 0; y < getHeight(); y++) {
                var xenergy = b(x - 1, y - 1) + 2 * b(x - 1, y) + b(x - 1, y + 1) - b(x + 1, y - 1) - 2 * b(x + 1, y) - b(x + 1, y + 1)
                var yenergy = b(x - 1, y - 1) + 2 * b(x, y - 1) + b(x + 1, y - 1) - b(x - 1, y + 1) - 2 * b(x, y + 1) - b(x + 1, y + 1)
                heatMap[x][y] = Math.sqrt(xenergy * xenergy + yenergy * yenergy);
                if(7 === 8 && 12 === x && 424 === y){
                    console.log(b(x + 1, y + 1))
                    console.log(getPixel(x + 1, y + 1));
                }
                max = (max > heatMap[x][y] ? max : heatMap[x][y]);
            }
        }
        maxHeat = max;

        return{
            maxHeat: maxHeat,
            heatMap: heatMap
        }

    };

    var initSeams = function(){

    };

    var getHeatMap = function(){

        var heatMap = initHeatMap();

        lwip.create(getWidth(), getHeight(), {r:0, g:0, b:0}, function(err, blankImage){

            var batch = blankImage.batch();

            for (var x = 0; x < blankImage.width(); x++) {
                for (var y = 0; y < blankImage.height(); y++) {
                    var color = parseInt(heatMap[x][y] / maxHeat * 255, 10);
                    
                    batch.setPixel(x, y, {r:color, g:color, b:color});
    
                }
            }
                
            batch.writeFile('/var/www/schleuder/public/heatmap.jpg', 'jpg', {quality:100}, function(){});

        });


    };

    var getSeams = function(){

    };

    var resize = function(dim){

    };

    return {
        getWidth: getWidth,
        getHeight: getHeight,
        initHeatMap:initHeatMap,
        getHeatMap: getHeatMap,
        getSeams:getSeams,
        resize:resize
    };
};


module.exports = seamCarver;

