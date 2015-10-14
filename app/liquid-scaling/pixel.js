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

Pixel.prototype.getColor = function(){
    return this.color.get();
};

Pixel.prototype.setColor = function(r, g, b, a){
    return this.color.set(r, g, b, a);
};

module.exports = Pixel;
