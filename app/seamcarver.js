var lwip = require('lwip');
var q = require('q');

var seamMatrix = require('./seamcarver/matrix');

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
    
    
    var getSeam = function(startCol){
        var seam = {
            value: 0,
            startCol:startCol,
            col:[startCol],
            containDuplicate: false
        };

        var seamDirection = function(x, y){

            var below = y + 1;

            var neighbours = {
                left: Number.MAX_VALUE,
                below: Number.MAX_VALUE,
                right: Number.MAX_VALUE
            };

            if(0 < x){
                neighbours.left = heatMap[below][(x - 1)];
            }

            neighbours.below = heatMap[below][x];

            if(getWidth() >= (x + 1)){
                neighbours.right = heatMap[below][(x + 1)];
            }

            //@TODO when two or thre neigbours have the same value: Go to each direction in a dubplicate of the current seam

            // go left
            if(neighbours.left < neighbours.below && neighbours.left < neighbours.right){
                seam.value += neighbours.left;
                seam.col.push(x-1);
            }
            // go right
            else if(neighbours.right < neighbours.below && neighbours.right < neighbours.left){
                seam.value += neighbours.right;
                seam.col.push(x+1);
            }
            else{
                seam.value += neighbours.below;
                seam.col.push(x);
            }
            
            if(seam.col.length < getHeight()){
                seamDirection(
                    seam.col[(seam.col.length-1)],
                    below
                );
            }
        };
        
        seamDirection(startCol, 0);
        return seam;

    };

    var compareSeam = function(a, b){
          if (a.value < b.value) {
            return -1;
          }
          if (a.value > b.value) {
            return 1;
          }
          // a must be equal to b
          return 0;
    };

    var generateSeams = function(){
        var seams = [];


        for (var col = 0, cols = getWidth(); col < cols;  col += 1) {
            seams.push(getSeam(col));
        }

        seams.sort(compareSeam);

        // loop all seams: if two or more uses the same pixels: delete the seam(s) with lower value
        for(var i = 0, x = seams.length; i < x; i += 1){

            var lowerValueSeam = seams[i];

            for(var j = (i + 1) , y = seams.length; j < y; j += 1){

                var higherValueSeam = seams[i];
            
                for(var col = 0, cols = lowerValueSeam.col.length; col < cols; col += 1){
                    
                    if(lowerValueSeam.col[col] === higherValueSeam.col[col]){
                        seams[j].containDuplicate = true;
                        break;
                    }
                }            
            }
            break; 

        }

        var unique = 0;
        var dubplicate = 0;

        for(var i = 0, x = seams.length; i < x; i += 1){
            if(seams[i].containDuplicate === true){
                dubplicate += 1;
            }
            else{
                unique += 1;
            }
        }              

        console.log(unique);
        console.log(dubplicate);


    };

    //generateSeams();



    var initSeams = function(){

        console.log("Starting to calculate seams");
        var yseam = [];

        var heatMapData = generateHeatMap();
        
        var heatMap = heatMapData.heatMap;  

        
        var ylen = height - 1;

        // initialize the last row of the seams
        for (var x = 0; x < width; x++) {
            yseam[x] = [];
            yseam[x][ylen] = x;
        }
        
        // sort the last row of the seams
        for (var i = 0; i < yseam.length; i++) {
            for (var j = i + 1; j < yseam.length; j++) {
                console.log(heatMap[yseam[i][ylen]][ylen] > heatMap[yseam[j][ylen]][ylen]);
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
                while (x2 < width) {
                    if (!isNaN(heatMap[x2][y])) 
                        break;
                    x2++;
                }
                
                var hx0 = heatMap[x0] ? heatMap[x0][y] : Number.MAX_VALUE;
                var hx1 = heatMap[x1][y] || Number.MAX_VALUE;
                var hx2 = heatMap[x2] ? heatMap[x2][y] : Number.MAX_VALUE;
                
                // Choose the least energy
                yseam[x][y] = hx0 < hx1 ? (hx0 < hx2 ? x0 : x2) : (hx1 < hx2 ? x1 : x2);
                
                if(100 === x && 100 === y){
                    //console.log('x1', x1)                    
                    //console.log(hx0, ' - ' ,  hx1)    
                }
                
                heatMap[yseam[x][y]][y] = NaN;
            }
        }
        
        console.log("Seams calculated");


        return yseam;

    };

    var getHeatMap = function(){
        
        var deferred = q.defer();
        
        var maxHeat = matrix.getMaxHeat();

        lwip.create(matrix.getWidth(), matrix.getHeight(), {r:0, g:0, b:0}, function(err, blankImage){

            var batch = blankImage.batch();
            
            for (var x = 0; x < matrix.getWidth(); x++) {
                
                for (var y = 0; y < matrix.getHeight(); y++) {
                    
                    var color = parseInt(matrix.getHeat(y, x) / maxHeat * 255, 10);
                    batch.setPixel(x, y, {r:color, g:color, b:color});
                    
                }
                
            }
            
            batch.writeFile('/var/www/schleuder/public/seamcarver/heatmap.jpg', 'jpg', {quality:100}, function(error){
                
                deferred.resolve();
                
            });
  
        });

        return deferred.promise;

    };

    var getSeams = function(){

    };

    var resize = function(dim){

    };

    return {
        getWidth: matrix.getWidth,
        getHeight: matrix.getHeight,
        getHeatMap: getHeatMap,
        initSeams:initSeams,
        getSeams:getSeams,
        resize:resize
    };
};


module.exports = seamCarver;

