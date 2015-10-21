var expect = require('chai').expect;
var assert = require('chai').assert

var Pixel = require('../../app/liquid-scaling/pixel');
var Color = require('../../app/liquid-scaling/color');

describe('Pixel', function() {

    var x = 8;
    var y = 8;
    var r = 10;
    var g = 11;
    var b = 12;
    var a = 255;

    it('can be created', function() {

        var pixel = new Pixel(x, y, r, g, b, a);

        expect(pixel).to.be.instanceof(Pixel);

	});

	it('can get x/y coords', function() {

        var pixel = new Pixel(x, y, r, g, b, a);

        expect(pixel.getX()).to.equal(x);
        expect(pixel.getY()).to.equal(y);

    });

    it('can get/set color', function() {

        var color = new Color(r, g, b, a);
        var pixel = new Pixel(x, y, r, g, b, a);

        expect(pixel.getColor()).to.deep.equal(color.get());

        var r = 20;
        var g = 21;
        var b = 22;
        var a = 23;

        pixel.setColor(r, g, b, a);

        var color = new Color(r, g, b, a);

        expect(pixel.getColor()).to.deep.equal(color.get());

	});

});

