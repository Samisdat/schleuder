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
    return this.color.rgb();  
};

Pixel.prototype.getRgba = function(){
    return this.color.rgba();  };

module.exports = Pixel;