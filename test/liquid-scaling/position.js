var expect = require('chai').expect;
var assert = require('chai').assert

var Position = require('../../app/liquid-scaling/position');

describe('Position', function() {

	it('can be created', function() {

        var x = 10;
        var y = 11;

		var position = new Position(x, y);
		
		expect(position).to.be.instanceof(Position);
	});	

	it('can get a and x ', function() {


        var x = 10;
        var y = 11;

		var position = new Position(x, y);

		expect(position.getX).to.be.a('function');
		expect(position.getX()).to.equal(x);

		expect(position.getY).to.be.a('function');
		expect(position.getY()).to.equal(y);

	});	

});

