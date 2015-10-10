var lwip = require('lwip');
var q = require('q');

var seamMatrix = require('./seamcarver/matrix');
var aSeam = require('./seamcarver/seam');


var ProgressBar = require('progress');
var seamCarver = function(lwipImage){

    var matrix = seamMatrix(lwipImage.width(), lwipImage.height());

    var fillMatrix = function(){

        for (var x = 0, width = matrix.getWidth(); x < width;  x += 1) {

            for (var y = 0, height = matrix.getHeight(); y < height;  y += 1) {

                var rgba = lwipImage.getPixel(x, y);
                matrix.setRGB(y, x, rgba.r, rgba.b, rgba.b);

            }

        }
    }
    
    fillMatrix();
    matrix.generateHeatMap();
    
    var getHeatMap = function(){

        var deferred = q.defer();
        
        var maxHeat = matrix.getMaxHeat();

        var bar = new ProgressBar(' draw heatmap [:bar] :percent :etas :elapsed', {
            complete: '=',
            incomplete: ' ',
            total: matrix.getWidth() * matrix.getHeight()
        });

        lwip.create(matrix.getWidth(), matrix.getHeight(), {r:0, g:0, b:0}, function(err, blankImage){

            var batch = blankImage.batch();
            
            for (var x = 0; x < matrix.getWidth(); x++) {
                
                for (var y = 0; y < matrix.getHeight(); y++) {
                    
                    var color = parseInt(matrix.getHeat(y, x) / maxHeat * 255, 10);
                    batch.setPixel(x, y, {r:color, g:color, b:color});
                    bar.tick();
                }
                
            }
            
            batch.writeFile('/var/www/schleuder/public/seamcarver/heatmap.jpg', 'jpg', {quality:100}, function(error){
                
                deferred.resolve();
                
            });
  
        });

        return deferred.promise;

    };

    var getSeams = function(){

        var seams = matrix.generateSeams();
        
        var usableSeams = 0;
        
        for(var i = 0, x = seams.length; i < x; i += 1){

            var useSeam = true;
            
            for(var row = 0, rows = matrix.getHeight(); row < rows; row += 1){
                var col = seams[i].getRow(row);

                if(true === matrix.isDeleted(row, col)){
                    useSeam = false;
                    break;   
                }
            }
            
            if(true === useSeam){
                usableSeams += 1;
                
                for(var row = 0, rows = matrix.getHeight(); row < rows; row += 1){
                    var col = seams[i].getRow(row);
                    matrix.markAsDeleted(row, col);
                }
            }
        }

        var bar = new ProgressBar(' draw image [:bar] :percent :etas :elapsed', {
            complete: '=',
            incomplete: ' ',
            total: (matrix.getWidth() - usableSeams) * matrix.getHeight()
        });

        lwip.create((matrix.getWidth() - usableSeams), matrix.getHeight(), {r:0, g:255, b:0}, function(err, blankImage){

            var batch = blankImage.batch();


            for(var row = 0, rows = matrix.getHeight(); row < rows; row +=1){
                var seamCol = 0;
                for(var col = 0, cols = (matrix.getWidth() - usableSeams); col < cols; col +=1){
                    bar.tick();
                    if(true === matrix.isDeleted(row, col)){
                        seamCol += 1;
                        continue;
                    }

                    var color = matrix.getRGB(row, seamCol);
                    batch.setPixel(seamCol, row, color);
                    seamCol += 1;
                }
            }
                        
            batch.writeFile('/var/www/schleuder/public/seamcarver/seams.jpg', 'jpg', {quality:100}, function(error){
                
                console.log('done')                
            });
  
        });

    };

    var resize = function(dim){

    };

    return {
        getWidth: matrix.getWidth,
        getHeight: matrix.getHeight,
        getHeatMap: getHeatMap,
        getSeams:getSeams,
        resize:resize
    };
};


module.exports = seamCarver;

