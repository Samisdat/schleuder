var q = require('q');

var seamMatrixItem = function(){

	var rgb = {
		r: 0,
		g: 0,
		b: 0
	};

	var heat;

	var memberInSeams = [];

	var getRGB = function(){
		return rgb;
	};

	var setRGB = function(r, g, b){

		r = parseInt(r, 10);
		g = parseInt(g, 10);
		b = parseInt(b, 10);

		//@TODO validating

		rgb.r = r;
		rgb.g = g;
		rgb.b = b;

	};

	var getHeat = function(){
		return heat;
	};

	var setHeat = function(_heat){
		heat = _heat;
	};

	var getMemberInSeams = function(){
		return memberInSeams;
	};

	var isMemberOfSeam = function(seam){
		return (memberInSeams.lastIndexOf(seam) !== -1);
	};

	var markAsMemberInSeams = function(seam){
		if(true === isMemberOfSeam(seam)){
			return;
		}
		memberInSeams.push(seam);
	};

	return{
		getRGB: getRGB,
		setRGB: setRGB,
		getHeat: getHeat,
		setHeat: setHeat,
		getMemberInSeams: getMemberInSeams,
		isMemberOfSeam: isMemberOfSeam,
		markAsMemberInSeams: markAsMemberInSeams
	};

};

module.exports.seamMatrixItem = seamMatrixItem;

var seamMatrix = function(width, height){

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
				matrix[row][col] = false;			
			} 

		} 
	};

	var init = function(){
		setMatrix();
	};
	init();

	return{
		getWidth: getWidth,
		getHeight: getHeight,
		getMatrix: getMatrix
	};

};

module.exports.seamMatrix = seamMatrix;

