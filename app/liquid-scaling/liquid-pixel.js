var Pixel = require('./pixel');

var LiquidPixel = function(x, y, r, g, b, a) {
    Pixel.call(this, x, y, r, g, b, a);

    this.heat = undefined;

    this.deleted = false;
};

LiquidPixel.prototype = Object.create(Pixel.prototype);
LiquidPixel.prototype.constructor = LiquidPixel;


LiquidPixel.prototype.getHeat = function(){
    return this.heat;
};

LiquidPixel.prototype.setHeat = function(heat){
    this.heat = heat;
};

LiquidPixel.prototype.isDeleted = function(){
    return (this.deleted === true);
};

LiquidPixel.prototype.markAsDeleted = function(){
    this.deleted = true;
};

module.exports = LiquidPixel;
