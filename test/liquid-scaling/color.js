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

	it('can get rgb ', function() {

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 255;

		var color = new Color(r, g, b, a);
		
		expect(color.rgb).to.be.a('function');

        var rgb = color.rgb();
		expect(rgb.r).to.equal(r);
		expect(rgb.g).to.equal(g);
		expect(rgb.b).to.equal(b);
		expect(rgb.a).to.equal(undefined);

	});	

	it('can get rgba ', function() {

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 255;

		var color = new Color(r, g, b, a);
		
		expect(color.rgb).to.be.a('function');

        var rgba = color.rgba();
		expect(rgba.r).to.equal(r);
		expect(rgba.g).to.equal(g);
		expect(rgba.b).to.equal(b);
		expect(rgba.a).to.equal(a);

	});	


});

