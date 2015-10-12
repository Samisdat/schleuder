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

	it('can get rgb', function() {

        var color = new Color(r, g, b);
		var pixel = new Pixel(x, y, r, g, b, a);
		
		expect(pixel.getRgb()).to.deep.equal(color.rgb());
	});	

	it('can get rgba', function() {

        var color = new Color(r, g, b, a);
		var pixel = new Pixel(x, y, r, g, b, a);
		
		expect(pixel.getRgba()).to.deep.equal(color.rgba());
	});	


});

