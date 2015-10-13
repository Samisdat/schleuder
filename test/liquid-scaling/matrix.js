var expect = require('chai').expect;
var assert = require('chai').assert

var Matrix = require('../../app/liquid-scaling/matrix');
var Color = require('../../app/liquid-scaling/color');

describe('Matrix', function() {

	it('can be created', function() {

        var matrix = new Matrix();

        expect(matrix).to.be.instanceof(Matrix);

    });

    it('can get width/height', function() {

        var width = 4;
        var height = 3;

        var matrix = new Matrix(width, height);

        expect(matrix.getWidth()).to.be.equal(width);
        expect(matrix.getHeight()).to.be.equal(height);

    });

    it('can get/set rgb', function() {

        var matrix = new Matrix(4, 3);

        var rgb = matrix.getRgb(1, 1);
        expect(rgb.r).to.be.undefined;
        expect(rgb.g).to.be.undefined;
        expect(rgb.b).to.be.undefined;

        var r = 10;
        var g = 11;
        var b = 12;

        matrix.setRgb(1, 1, r, g, b);
        var rgb = matrix.getRgb(1, 1);
        expect(rgb.r).to.equal(r);
        expect(rgb.g).to.equal(g);
        expect(rgb.b).to.equal(b);

	});

	it('can get/set heat', function() {

        var matrix = new Matrix(4, 3);

		expect(matrix.getHeat(1, 1)).to.be.undefined;

		var heat = 10;
		matrix.setHeat(1, 1, heat);
		expect(matrix.getHeat(1,1)).to.be.equal(heat);

	});

	it('can check deteled and mark as deleted', function() {

        var matrix = new Matrix(4, 3);

        expect(matrix.isDeleted(1, 1)).to.be.false;

        matrix.markAsDeleted(1,1);
        expect(matrix.isDeleted(1,1)).to.be.true;

    });


});

