/*
 * Testdriven reverse implementing
 * https://github.com/axemclion/seamcarving
 */

var fs = require ('fs');
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

		this.timeout(50000);

    	it("generate a heatmap of a given image", function(done) {

			var seamCarving = seamCarver(lwipImage);
			var heatmap = seamCarving.initHeatMap();

			var workerHeatMapFile = __dirname + '/data/heatmap.json';

			var workerHeatMap = fs.readFileSync(workerHeatMapFile, 'utf8');
			workerHeatMap = JSON.parse(workerHeatMap);

			expect(heatmap.heatMap.length).to.equal(workerHeatMap.length);

			var threshold = 2;

			for(var i = 0, x = heatmap.heatMap.length; i < x; i += 1){
				for(var j = 0, y = heatmap.heatMap[i].length; j < y; j += 1){
					var nodejsHeatMapItem = heatmap.heatMap[i][j];
					var workerHeatMapItem = workerHeatMap[i][j];

					var isInThreshold = false;
					if(nodejsHeatMapItem === workerHeatMapItem){
						isInThreshold = true;
					}
					if(nodejsHeatMapItem < workerHeatMapItem && (nodejsHeatMapItem + threshold) >= workerHeatMapItem){
						isInThreshold = true;	
					}
					if(nodejsHeatMapItem > workerHeatMapItem && (nodejsHeatMapItem - threshold) <= workerHeatMapItem){
						isInThreshold = true;	
					}
					expect(isInThreshold).to.equal(true, nodejsHeatMapItem + ' ' + workerHeatMapItem);
				}
			}

			done();
		});

		it("generate a heatmap image of a given image", function(done) {

			var fileName = '/var/www/schleuder/public/seamcarver/heatmap.jpg';
			if(fs.existsSync(fileName)){
				fs.unlinkSync(fileName);
			}

			expect(fs.existsSync(fileName)).to.equal(false);

			var seamCarving = seamCarver(lwipImage);
			seamCarving.getHeatMap()
			.then(function(){
				expect(fs.existsSync(fileName)).to.equal(true);
				done();
			});
			
		});

	});

});
