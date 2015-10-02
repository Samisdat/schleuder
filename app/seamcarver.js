
var seamCarver = function(lwipImage){

    var width = lwipImage.width();
    var height = lwipImage.height();

    var getWidth = function(){
        return lwipImage.width();
    };

    var getHeight = function(){
        return lwipImage.height();
    };

    var getPixel = function(){

    };

    var putPixel = function(x, y, color){

    };

    var copyImage = function(){

    };

    var initHeatMap = function(){

    };

    var initSeams = function(){

    };

    var getHeatMap = function(){

        var heatMap= initHeatMap();

        lwip.create(image.width(), image.height(), {r:0, g:0, b:0}, function(err, blankImage){

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
        getHeatMap: getHeatMap,
        getSeams:getSeams,
        resize:resize
    };
};


module.exports = seamCarver;

