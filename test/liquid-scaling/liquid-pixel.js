var expect = require('chai').expect;
var assert = require('chai').assert

var LiquidPixel = require('../../app/liquid-scaling/liquid-pixel');
var Color = require('../../app/liquid-scaling/color');

describe('LiquidPixel', function() {

    var x = 8;
    var y = 8;
    var r = 10;
    var g = 11;
    var b = 12;
    var a = 255;

	it('can be created', function() {

		var liquidPixel = new LiquidPixel(x, y, r, g, b, a);
		
		expect(liquidPixel).to.be.instanceof(LiquidPixel);
	});	

	it('can get/set heat', function() {

		var liquidPixel = new LiquidPixel(x, y, r, g, b, a);
		
		expect(liquidPixel.getHeat()).to.be.undefined;
		
		var heat = 10;
		liquidPixel.setHeat(heat);
		expect(liquidPixel.getHeat()).to.be.equal(heat);
		
	});	

	it('can check deteled and mark as deleted', function() {

		var liquidPixel = new LiquidPixel(x, y, r, g, b, a);
		
		expect(liquidPixel.isDeleted()).to.be.false;
		
		liquidPixel.markAsDeleted();
		expect(liquidPixel.isDeleted()).to.be.true;
		
	});	


});

