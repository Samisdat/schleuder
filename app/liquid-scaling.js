var lwip = require('lwip');
var q = require('q');
var fs = require('fs');

var Canvas = require('canvas');
var Image = Canvas.Image

var seamMatrix = require('./liquid-scaling/matrix');

var ProgressBar = require('progress');
var seamCarver = function(canvas, ctx){

    var start = new Date;
    var matrix = new seamMatrix(ctx.canvas.width, ctx.canvas.height);

    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    var getPixel = function(x, y){
        var base = (y * ctx.canvas.width + x) * 4;
        return {
            r: imageData[base + 0],
            g: imageData[base + 1],
            b: imageData[base + 2],
            a: imageData[base + 3]
        };
    }

    var fillMatrix = function(){
        console.time('fillMatrix slow');

        for (var x = 0, width = matrix.getWidth(); x < width;  x += 1) {

            for (var y = 0, height = matrix.getHeight(); y < height;  y += 1) {
                var color = getPixel(x, y);
                matrix.setColor(y, x, color.r, color.g, color.b, color.a);
            }
        }

        console.timeEnd('fillMatrix slow');

    }
    console.log('fillMatrixCanvas')
    fillMatrix();
    matrix.generateHeatMap();

    var getHeatMap = function(){

        var deferred = q.defer();

        var maxHeat = matrix.getMaxHeat();

        var newImageData = [];

        var setPixel = function(x, y, color){
            var base = (y * matrix.getWidth() + x) * 4;
            newImageData[base + 0] = color.r;
            newImageData[base + 1] = color.g;
            newImageData[base + 2] = color.b;
            newImageData[base + 3] = 255;
        };

        for (var x = 0; x < matrix.getWidth(); x++) {

            for (var y = 0; y < matrix.getHeight(); y++) {

                var color = parseInt(matrix.getHeat(y, x) / maxHeat * 255, 10);
                setPixel(x, y, {r:color, g:color, b:color});
            }

        }

        var newImage = ctx.createImageData(matrix.getWidth(), matrix.getHeight());
        for (var i = 0; i < newImageData.length; i++) {
            newImage.data[i] = newImageData[i];
        }

        ctx.putImageData(newImage, 0, 0);
          ctx.canvas.toBuffer(function(err, buf){
              console.log(err)
              console.log('/var/www/schleuder/public/seamcarver/heatmap-ctx.jpg')
            fs.writeFile('/var/www/schleuder/public/seamcarver/heatmap-ctx.jpg', buf, function(err){
                              console.log(err)
              console.log('Resized and saved in %dms', new Date - start);
            });
          });


        return deferred.promise;

    };

    var getSeams = function(){

        var seamLessMatrix = matrix.getReduced();

        var newImageData = [];

        var setPixel = function(x, y, color){
            var base = (y * matrix.getWidth() + x) * 4;
            newImageData[base + 0] = color.r;
            newImageData[base + 1] = color.g;
            newImageData[base + 2] = color.b;
            newImageData[base + 3] = 255;
        };

        for (var x = 0; x < seamLessMatrix.getWidth(); x++) {

            for (var y = 0; y < seamLessMatrix.getHeight(); y++) {

                var color = seamLessMatrix.getRGB(y, x);
                setPixel(x, y, {r:color, g:color, b:color});
            }

        }

        var newImage = ctx.createImageData(seamLessMatrix.getWidth(), seamLessMatrix.getHeight());
        for (var i = 0; i < newImageData.length; i++) {
            newImage.data[i] = newImageData[i];
        }

        ctx.putImageData(newImage, 0, 0);
          ctx.canvas.toBuffer(function(err, buf){
              console.log(err)
              console.log('/var/www/schleuder/public/seamcarver/seamless-ctx.jpg')
            fs.writeFile('/var/www/schleuder/public/seamcarver/seamless-ctx.jpg', buf, function(err){
                              console.log(err)
              console.log('Resized and saved in %dms', new Date - start);
            });
          });

        return;
        var seamLessMatrix = [];

        for(var row = 0, rows = matrix.getHeight(); row < rows; row +=1){
            var seamLessRow = [];
            for(var col = 0, cols = matrix.getWidth(); col < cols; col +=1){
                if(true === matrix.isDeleted(row, col)){
                    continue;
                }

                var color = matrix.getRGB(row, col);

                seamLessRow.push(color);

            }

            seamLessMatrix.push(seamLessRow);
        }
        /*
        var bar = new ProgressBar(' draw image [:bar] :percent :etas :elapsed', {
            complete: '=',
            incomplete: ' ',
            total: (matrix.getWidth() - usableSeams) * matrix.getHeight()
        });
        */
        console.time('drawImage');

        lwip.create(seamLessMatrix[0].length, seamLessMatrix.length, {r:0, g:255, b:0}, function(err, blankImage){

            var batch = blankImage.batch();

            for(var row = 0, rows = seamLessMatrix.length; row < rows; row +=1){
                for(var col = 0, cols = seamLessMatrix[0].length; col < cols; col +=1){

                    var color = seamLessMatrix[row][col]
                    batch.setPixel(col, row, color);
                }
            }

            batch.writeFile('/var/www/schleuder/public/seamcarver/seams.jpg', 'jpg', {quality:100}, function(error){

                console.timeEnd('drawImage');

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

