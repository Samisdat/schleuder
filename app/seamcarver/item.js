var seamMatrixItem = function(row, col){

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
	
	var deleted = false;

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
	
	var isDeleted = function(){
    	return (deleted === true);
	};
	
	var markAsDeleted = function(){
    	deleted = true;
	};
	
	var getRow = function(){
    	return row;
	};

	var getCol = function(){
    	return col;    	
	};

	return{
		getRGB: getRGB,
		setRGB: setRGB,
		getHeat: getHeat,
		setHeat: setHeat,
		getMemberInSeams: getMemberInSeams,
		isMemberOfSeam: isMemberOfSeam,
		markAsMemberInSeams: markAsMemberInSeams,
		getRow: getRow,
		getCol: getCol,
		isDeleted: isDeleted,
		markAsDeleted:markAsDeleted
	};

};

module.exports = seamMatrixItem;
