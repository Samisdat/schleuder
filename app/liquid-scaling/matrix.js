var heatmap = require('./heatmap');
var Seams = require('./seams');
var Seam = require('./seam');

var Matrix = function(colors) {

    this.seams;

    this.width = colors[0].length;
    this.height = colors.length;


    this.matrix = colors;

    var heatMap = heatmap(colors)
    this.maxHeat = heatMap.getMaxHeat();


};

Matrix.prototype.getWidth = function(){
    return this.width;
};

Matrix.prototype.getHeight = function(){
    return this.height;
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.getColor = function(row, col){
    try{
        return this.matrix[row][col].get();
    }
    catch(e){
        console.log(row, col, this.getWidth(), this.getHeight())
    }
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.setColor = function(row, col, r, g, b, a){
    this.matrix[row][col].setColor(r, g, b, a);
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.getHeat = function(row, col){
    return this.matrix[row][col].getHeat();
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.setHeat = function(row, col, heat){
    this.matrix[row][col].setHeat(heat);
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.isDeleted = function(row, col){
    return this.matrix[row][col].isDeleted();
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.markAsDeleted = function(row, col){
    return this.matrix[row][col].markAsDeleted();
};

Matrix.prototype.getMaxHeat = function(){
    return this.maxHeat;
};

Matrix.prototype.generateSeams = function(){

    if(undefined !== this.seams){
        return;
    }

    var seams = new Seams();

    for(var col = 1, cols = this.getWidth(); col < cols; col += 1){
        seams.add(
            new Seam( col, this.getHeat(0, col))
        );
    }

    for(var row = 1, rows = this.getHeight(); row < rows; row += 1){
        for(var i = 0, x = seams.getLength(); i < x; i += 1){
            var seam = seams.get(i);
            var last = seam.getLast();

            var left = (last > 0) ? this.getHeat(row, last - 1) : Number.MAX_VALUE;
            var center = this.getHeat(row, last );
            var right = (last < (this.getWidth() - 1)) ? this.getHeat(row, last + 1) : Number.MAX_VALUE;

            if(center <= left && center <= right){
                if(center === left){
                    //console.log(center, left)
                    //console.log('center and left are tie');
                }
                if(center === right){
                    //console.log(center, right)
                    //console.log('center and right are tie');
                }
                //console.log('dir center');
                seam.addRow(last, this.getHeat(row, last));
            }
            else if(left < center && left <= right){
                if(left === right){
                    //console.log(left, right)
                    //console.log('right and left are tie');
                }

                //console.log('dir left');
                seam.addRow( (last - 1), this.getHeat(row, (last - 1)));
            }
            else if(right < center && right < left){
                //console.log('dir right');
                seam.addRow( (last + 1), this.getHeat(row, (last + 1)));
            }
        }
    }

    seams.filter();

    this.seams = seams.getUnique();

};

Matrix.prototype.numberOfSeams = function(){
    return this.seams.length;
};

Matrix.prototype.getReduced = function(width){

    this.generateSeams();

    var reduceBy = this.getWidth() - width;

    if( reduceBy > this.seams.length){
        reduceBy = this.seams.length;
    }

    for(var i = 0; i < reduceBy; i += 1){

        for(var row = 0, rows = this.getHeight(); row < rows; row += 1){

            var col = this.seams[i].getRow(row);
            this.markAsDeleted(row, col);

        }
    }

    var seamLessColors = [];

    for(var row = 0, rows = this.getHeight(); row < rows; row +=1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = this.getWidth(); col < cols; col +=1){
            if(true === this.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = this.matrix[row][col];
            seamCol += 1;
        }
    }



    var seamLessMatrix = new Matrix(seamLessColors);


    return seamLessMatrix;
};

module.exports = Matrix;
