var expect = require('chai').expect;
var assert = require('chai').assert

var HeatPixel = require('../../app/liquid-scaling/heat-pixel');
var Color = require('../../app/liquid-scaling/color');

describe('HeatPixel', function() {

    var x = 8;
    var y = 8;
    var r = 10;
    var g = 11;
    var b = 12;
    var a = 255;

	it('can be created', function() {

		var heatPixel = new HeatPixel(x, y, r, g, b, a);
		
		expect(heatPixel).to.be.instanceof(HeatPixel);
	});	

	it('can get/set heat', function() {

		var heatPixel = new HeatPixel(x, y, r, g, b, a);
		
		expect(heatPixel.getHeat()).to.be.undefined;
		
		var heat = 10;
		heatPixel.setHeat(heat);
		expect(heatPixel.getHeat()).to.be.equal(heat);
		
		
	});	


});

