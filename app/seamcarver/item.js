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

module.exports = seamMatrixItem;
