var expect = require('chai').expect;
var assert = require('chai').assert

var seamMatrixModule = require('../../app/seamcarver/matrix');


describe('SeamCarver Matrix Item', function() {

	it('can be initialised ', function() {

		var seamMatrixItem = seamMatrixModule.seamMatrixItem();
		
		expect(seamMatrixItem.getRGB).to.be.a('function');
		expect(seamMatrixItem.setRGB).to.be.a('function');
		expect(seamMatrixItem.getHeat).to.be.a('function');
		expect(seamMatrixItem.setHeat).to.be.a('function');
		expect(seamMatrixItem.getMemberInSeams).to.be.a('function');
		expect(seamMatrixItem.isMemberOfSeam).to.be.a('function');
		expect(seamMatrixItem.markAsMemberInSeams).to.be.a('function');

	});	

	it('can set rgb and get rgb', function() {

		var seamMatrixItem = seamMatrixModule.seamMatrixItem();

		var rgb = seamMatrixItem.getRGB();

		expect(rgb.r).to.equal(0);
		expect(rgb.g).to.equal(0);
		expect(rgb.b).to.equal(0);
		
		var r = 10;
		var g = 11;
		var b = 12;

		seamMatrixItem.setRGB(r, g, b);

		var rgb = seamMatrixItem.getRGB();

		expect(rgb.r).to.equal(r);
		expect(rgb.g).to.equal(g);
		expect(rgb.b).to.equal(b);

	});		

	it('can set het and get heat', function() {

		var seamMatrixItem = seamMatrixModule.seamMatrixItem();
		
		var heat = 100;

		expect(seamMatrixItem.getHeat()).to.equal(undefined);

		seamMatrixItem.setHeat(heat);

		expect(seamMatrixItem.getHeat()).to.equal(heat);

	});		

	it('shoud manage seam membership', function() {

		var seamMatrixItem = seamMatrixModule.seamMatrixItem();
		
		expect(seamMatrixItem.getMemberInSeams()).to.deep.equal([]);
		
		expect(seamMatrixItem.isMemberOfSeam(1)).to.be.false;

		seamMatrixItem.markAsMemberInSeams(1);
		expect(seamMatrixItem.isMemberOfSeam(1)).to.be.true;
		expect(seamMatrixItem.getMemberInSeams()).to.deep.equal([1]);

		seamMatrixItem.markAsMemberInSeams(2);
		expect(seamMatrixItem.isMemberOfSeam(2)).to.be.true;
		expect(seamMatrixItem.getMemberInSeams()).to.deep.equal([1,2]);

		seamMatrixItem.markAsMemberInSeams(1);
		expect(seamMatrixItem.isMemberOfSeam(2)).to.be.true;
		expect(seamMatrixItem.getMemberInSeams()).to.deep.equal([1,2]);

	});		


});


describe('SeamCarver Matrix', function() {

	it('can be initialised with witdth and height', function() {

		var width = 20;
		var height = 10;

		var seamMatrix = seamMatrixModule.seamMatrix(width, height);
		
		expect(seamMatrix.getWidth).to.be.a('function');
		expect(seamMatrix.getHeight).to.be.a('function');

		expect(seamMatrix.getWidth()).to.equal(width);
		expect(seamMatrix.getHeight()).to.equal(height);

		expect(seamMatrix.getMatrix).to.be.a('function');

		var matrix = seamMatrix.getMatrix();
		expect(matrix).to.be.a('array');
		expect(matrix.length).to.equal(height);
		expect(matrix[0].length).to.equal(width);

		expect(matrix[0][0].getRGB).to.be.a('function');
		expect(matrix[0][0].setRGB).to.be.a('function');
		expect(matrix[0][0].getHeat).to.be.a('function');
		expect(matrix[0][0].setHeat).to.be.a('function');
		expect(matrix[0][0].getMemberInSeams).to.be.a('function');
		expect(matrix[0][0].isMemberOfSeam).to.be.a('function');
		expect(matrix[0][0].markAsMemberInSeams).to.be.a('function');



	});

	it('members can be set', function() {

		var seamMatrix = seamMatrixModule.seamMatrix(10, 10);

		var r = 10;
		var g = 11;
		var b = 12;

		seamMatrix.setRGB(0, 0, r, g, b);

		var rgb = seamMatrix.getRGB(0, 0);

		expect(rgb.r).to.equal(r);
		expect(rgb.g).to.equal(g);
		expect(rgb.b).to.equal(b);

	});



});
