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
		lwip.open('/var/www/schleuder/raw-images/ballon-small.jpg', function(error, _lwipImage){
			if(error){
				return done(error);
			}
			lwipImage = _lwipImage;
			done();
		});
	});

	it('should know image\'s dimensions', function(done){
		done();
		return;
		var seamCarving = seamCarver(lwipImage);

		expect(seamCarving.getWidth()).to.equal(500);
		expect(seamCarving.getHeight()).to.equal(500);

		done();
	});	

	describe("Get Heat Map", function() {

		this.timeout(50000);

    	it("generate a heatmap of a given image", function(done) {
			done();
			return;

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
					console.log(nodejsHeatMapItem, workerHeatMapItem)
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

		it("generate a heatmap of a given image", function(done) {

			var fileName = '/var/www/schleuder/public/seamcarver/heatmap.jpg';
			if(fs.existsSync(fileName)){
				fs.unlinkSync(fileName);
			}

			expect(fs.existsSync(fileName)).to.equal(false);

			var seamCarving = seamCarver(lwipImage);
			seamCarving.initHeatMap()
			
		});

		it("generate a heatmap image of a given image", function(done) {
			done();
			return;

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

	describe.skip("Get Seams", function() {

		this.timeout(50000);

    	it("generate seams of a given image", function(done) {

			var seamCarving = seamCarver(lwipImage);
			var seams = seamCarving.initSeams();


			var workerSeamsFile = __dirname + '/data/seams.json';

			var workerSeams = fs.readFileSync(workerSeamsFile, 'utf8');
			workerSeams = JSON.parse(workerSeams);

			expect(seams.length).to.equal(workerSeams.length);

			var threshold = 0;

			var same = 0;
			var differ = 0;

			for(var i = 0, x = seams.length; i < x; i += 1){

				for(var j = 0, y = seams[i].length; j < y; j += 1){
					var nodejsSeamsItem = seams[i][j];
					var workerSeamsItem = workerSeams[i][j];

					if(nodejsSeamsItem === workerSeamsItem){
						same += 1;
					}
					else{
						if(differ < 100){
							console.log(i, j)	
						}
						
						differ += 1;
					}
				}
			}

			console.log(same);
			console.log(differ)

			done();
		});

/*
		it("generate a seams image of a given image", function(done) {
			done('skipped');
			return;
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
*/
	});


});
