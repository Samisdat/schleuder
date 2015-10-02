/*
 * Testdriven reverse implementing
 * https://github.com/axemclion/seamcarving
 */

var lwip = require('lwip');
var expect    = require("chai").expect;
var seamCarver = require("../app/seamcarver");

//getHeatMap: getHeatMap,
//getSeams:getSeams,
//resize:resize

describe("SeamCarver", function() {

	var lwipImage;

	before(function(done) {
		lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(error, _lwipImage){
			if(error){
				return done(error);
			}
			lwipImage = _lwipImage;
			done();
		});
	});

	it('should know image\'s dimensions', function(done){

		var seamCarving = seamCarver(lwipImage);

		expect(seamCarving.getWidth()).to.equal(500);
		expect(seamCarving.getHeight()).to.equal(500);

		done();
	});	

	describe("Get Heat Map", function() {
    	it("generate a heatmap of a given image", function() {
		});
	});

});
