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

    it('can get/set color', function() {

        var matrix = new Matrix(4, 3);

        var rgba = matrix.getColor(1, 1);
        expect(rgba.r).to.be.undefined;
        expect(rgba.g).to.be.undefined;
        expect(rgba.b).to.be.undefined;
        expect(rgba.a).to.be.undefined;

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 13;

        matrix.setColor(1, 1, r, g, b, a);
        var rgba = matrix.getColor(1, 1);
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);

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

