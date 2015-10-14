var LiquidPixel = require('./liquid-pixel');

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
    return this.matrix[row][col].getColor();
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

Matrix.prototype.setMaxHeat = function(){

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

    return (color.r + color.g + color.b  + color.a);

}

// the heatmap implenentation from https://github.com/axemclion/seamcarving generates ver high values for all four edges
// for now: just replace all edge pixels with their neibours
Matrix.prototype.correctHeatMap = function(){

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

    this.correctHeatMap();
    this.setMaxHeat();

};


module.exports = Matrix;
