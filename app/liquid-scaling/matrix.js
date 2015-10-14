var LiquidPixel = require('./liquid-pixel');
var Color = require('./color');
var Seams = require('./seams');
var Seam = require('./seam');

var emptyMatrix = function(){

	for(var row = 0; row < this.height; row += 1){

		this.matrix[row] = [];

		for(var col = 0; col < this.width; col += 1){

			this.matrix[row][col] = new LiquidPixel(row, col);

		}

	}
};

var Matrix = function(width, height) {
    this.width = width;
    this.height = height;

    this.maxHeat = 0;
    this.matrix = [];

    emptyMatrix.call(this);

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
        return this.matrix[row][col].getColor();
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

var setMaxHeat = function(){

    var maxHeatInRows = [];

    for (var row = 0, rows = this.getHeight(); row < rows;  row += 1) {

        var maxHeatInRow = [];

        for (var col = 0, cols = this.getWidth(); col < cols;  col += 1) {

            maxHeatInRow.push(this.getHeat(row, col));

        }
        maxHeatInRows.push(Math.max.apply(Math, maxHeatInRow));

    }

    this.maxHeat = Math.max.apply(Math, maxHeatInRows);

};

Matrix.prototype.sumColorChanels = function(x, y){

    if (x < 0 || y < 0 || x >= this.getWidth() || y >= this.getHeight()) {

        return 0;

    }

    var color = this.getColor(y, x);

    return (color.r + color.g + color.b);

}

// the heatmap implenentation from https://github.com/axemclion/seamcarving generates ver high values for all four edges
// for now: just replace all edge pixels with their neibours
var correctHeatMap = function(){

    var lastRow = this.getHeight() - 1;
    var lastCol = this.getWidth() - 1;

    for (var x = 0, width = this.getWidth(); x < width;  x += 1) {

        this.setHeat(0, x, this.getHeat(1, x));
        this.setHeat(lastRow, x, this.getHeat(lastRow -1, x));

    }

    for (var y = 0, height = this.getHeight(); y < height;  y += 1) {

        this.setHeat(y, 0, this.getHeat(y, 1));
        this.setHeat(y, lastCol, this.getHeat(y, lastCol - 1));

    }

};

/**
 * Heatmap taken from
 * https://github.com/axemclion/seamcarving
 */
Matrix.prototype.generateHeatMap = function(){

    for (var x = 0, width = this.getWidth(); x < width;  x += 1) {

        for (var y = 0; y < this.getHeight(); y++) {

            var xenergy = this.sumColorChanels(x - 1, y - 1) + 2 * this.sumColorChanels(x - 1, y) + this.sumColorChanels(x - 1, y + 1) - this.sumColorChanels(x + 1, y - 1) - 2 * this.sumColorChanels(x + 1, y) - this.sumColorChanels(x + 1, y + 1)
            var yenergy = this.sumColorChanels(x - 1, y - 1) + 2 * this.sumColorChanels(x, y - 1) + this.sumColorChanels(x + 1, y - 1) - this.sumColorChanels(x - 1, y + 1) - 2 * this.sumColorChanels(x, y + 1) - this.sumColorChanels(x + 1, y + 1)
            this.setHeat(y, x, Math.sqrt(xenergy * xenergy + yenergy * yenergy) );

        }
    }

    correctHeatMap.call(this);
    setMaxHeat.call(this);

};

Matrix.prototype.generateSeams = function(){

    console.time('generateSeams');

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
    console.timeEnd('generateSeams');

    return seams;
};


Matrix.prototype.getReduced = function(){
    var seams = this.generateSeams();

    var deletableSeams = seams.getUnique();

    for(var i = 0, x = deletableSeams.length; i < x; i += 1){

        for(var row = 0, rows = this.getHeight(); row < rows; row += 1){

            var col = deletableSeams[i].getRow(row);
            this.markAsDeleted(row, col);

        }
    }

    console.log(deletableSeams.length);

    var seamLessMatrix = new Matrix((this.getWidth() - deletableSeams.length), this.getHeight());

    for(var row = 0, rows = this.getHeight(); row < rows; row +=1){
        var seamCol = 0;
        for(var col = 0, cols = this.getWidth(); col < cols; col +=1){
            if(true === this.isDeleted(row, col)){
                continue;
            }

            var color = this.getColor(row, col);

            seamLessMatrix.setColor(row, seamCol, color.r, color.g, color.b, color.a);
            seamCol += 1;
        }
    }

    return seamLessMatrix;
};

module.exports = Matrix;
