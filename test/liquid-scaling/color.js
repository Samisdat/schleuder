var expect = require('chai').expect;
var assert = require('chai').assert

var Color = require('../../app/liquid-scaling/color');

describe('Color', function() {

	it('can be created', function() {

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 255;

		var color = new Color(r, g, b, a);

		expect(color).to.be.instanceof(Color);
	});

	it('can get/set rgb ', function() {

        var r = 10;
        var g = 11;
        var b = 12;

		var color = new Color(r, g, b);

		expect(color.getRgb).to.be.a('function');
		expect(color.setRgb).to.be.a('function');

        var rgb = color.getRgb();
        expect(rgb.r).to.equal(r);
        expect(rgb.g).to.equal(g);
        expect(rgb.b).to.equal(b);
        expect(rgb.a).to.equal(undefined);

        var r = 20;
        var g = 21;
        var b = 22;

        color.setRgb(r, g, b);

        var rgb = color.getRgb();
        expect(rgb.r).to.equal(r);
        expect(rgb.g).to.equal(g);
        expect(rgb.b).to.equal(b);
        expect(rgb.a).to.equal(undefined);



	});

	it('can get/set rgba ', function() {

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 255;

        var color = new Color(r, g, b, a);

        expect(color.setRgb).to.be.a('function');
        expect(color.setRgb).to.be.a('function');

        var rgba = color.getRgba();
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);

        var r = 20;
        var g = 21;
        var b = 22;
        var a = 23;

        color.setRgba(r, g, b, a);
        var rgba = color.getRgba();
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);

	});


});

