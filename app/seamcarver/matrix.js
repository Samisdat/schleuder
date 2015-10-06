var q = require('q');

var seamMatrixItem = require('./item');

var seamMatrix = function(width, height){

    var maxHeat;
	var matrix;

	var getWidth = function(){
    	
		return width;
		
	};

	var getHeight = function(){
    	
		return height;
		
	};

	var getMatrix = function(){
    	
		return matrix;
		
	};

	var setMatrix = function(){

		matrix = [];

		for(var row = 0; row < height; row += 1){

			matrix[row] = [];

			for(var col = 0; col < width; col += 1){
    			
				matrix[row][col] = seamMatrixItem();			
				
			} 

		} 
	};

    /**
     * Proxy Matrix Items method
     */  
	var getRGB = function(row, col){
    	
		return matrix[row][col].getRGB();
		
	};

    /**
     * Proxy Matrix Items method
     */  
	var setRGB = function(row, col, r, g, b){
    	
		matrix[row][col].setRGB(r, g, b);
		
	};

    /**
     * Proxy Matrix Items method
     */  
	var getHeat = function(row, col){
    	
		return matrix[row][col].getHeat();
		
	};

    /**
     * Proxy Matrix Items method
     */  
	var setHeat = function(row, col, heat){
    	
		matrix[row][col].setHeat(heat);
		
	};

    var getMaxHeat = function(){
        
        return maxHeat;
        
    };

    var setMaxHeat = function(){
        
        var maxHeatInRows = [];

        for (var row = 0, rows = getHeight(); row < rows;  row += 1) {
            
            var maxHeatInRow = [];
            
            for (var col = 0, cols = getWidth(); col < cols;  col += 1) {
                
                maxHeatInRow.push(getHeat(row, col));
                
            }
            
            maxHeatInRows.push(Math.max.apply(Math, maxHeatInRow));
            
        }

        maxHeat = Math.max.apply(Math, maxHeatInRows);
        
    };

    var b = function(x, y){
        
        if (x < 0 || y < 0 || x >= getWidth() || y >= getHeight()) {
            
            return 0;
            
        }
        
        var pixel = getRGB(y, x);
        
        return (pixel.r + pixel.g + pixel.b);
        
    }

    // the heatmap implenentation from https://github.com/axemclion/seamcarving generates ver high values for all four edges
    // for now: just replace all edge pixels with their neibours
    var correctHeatMap = function(){

        var lastRow = getHeight() - 1;
        var lastCol = getWidth() - 1;
        
        for (var x = 0, width = getWidth(); x < width;  x += 1) {
            
            setHeat(0, x, getHeat(1, x));
            setHeat(lastRow, x, getHeat(lastRow -1, x));
            
        }

        for (var y = 0, height = getHeight(); y < height;  y += 1) {
            
            setHeat(y, 0, getHeat(y, 1));
            setHeat(y, lastCol, getHeat(y, lastCol - 1));
            
        }
             
    };

    /**
     * Heatmap taken from 
     * https://github.com/axemclion/seamcarving
     */
    var generateHeatMap = function(){

        for (var x = 0, width = getWidth(); x < width;  x += 1) {
        
            for (var y = 0; y < getHeight(); y++) {
                
                var xenergy = b(x - 1, y - 1) + 2 * b(x - 1, y) + b(x - 1, y + 1) - b(x + 1, y - 1) - 2 * b(x + 1, y) - b(x + 1, y + 1)
                var yenergy = b(x - 1, y - 1) + 2 * b(x, y - 1) + b(x + 1, y - 1) - b(x - 1, y + 1) - 2 * b(x, y + 1) - b(x + 1, y + 1)
                setHeat(y, x, Math.sqrt(xenergy * xenergy + yenergy * yenergy) );
                
            }
        }
        
        correctHeatMap();
        setMaxHeat();

    };

	var init = function(){
    	
		setMatrix();
		
	};
	
	init();

	return{
		getWidth: getWidth,
		getHeight: getHeight,
		getMatrix: getMatrix,
		getMaxHeat: getMaxHeat,
		generateHeatMap: generateHeatMap,
		getRGB: getRGB,
		setRGB: setRGB,
        getHeat: getHeat

	};

};

module.exports = seamMatrix;

