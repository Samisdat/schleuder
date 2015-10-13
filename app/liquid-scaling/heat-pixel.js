var Pixel = require('./pixel');

var HeatPixel = function(x, y, r, g, b, a) {
    Pixel.call(this, x, y, r, g, b, a);
    
    this.heat = undefined;
};

HeatPixel.prototype = Object.create(Pixel.prototype);
HeatPixel.prototype.constructor = HeatPixel;


HeatPixel.prototype.getHeat = function(){
    return this.heat;  
};

HeatPixel.prototype.setHeat = function(heat){
    this.heat = heat;  
};

module.exports = HeatPixel;