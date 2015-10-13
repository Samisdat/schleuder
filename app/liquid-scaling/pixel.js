var Position = require('./position');
var Color = require('./color');

var Pixel = function(x, y, r, g, b, a) {
    this.position = new Position(x, y);
    this.color = new Color(r, g, b, a);
};

Pixel.prototype.getX = function(){
    return this.position.getX();
};

Pixel.prototype.getY = function(){
    return this.position.getY();
};

Pixel.prototype.getRgb = function(){
    return this.color.getRgb();
};

Pixel.prototype.setRgb = function(r, g, b){
    return this.color.setRgb(r, g, b);
};


Pixel.prototype.getRgba = function(){
    return this.color.getRgba();
};

Pixel.prototype.setRgba = function(r, g, b, a){
    return this.color.getRgba(r, g, b, a);
};

module.exports = Pixel;
