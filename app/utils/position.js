var Position = function(x, y) {
    this.x = x;
    this.y = y;
};

Position.prototype.getX = function(){
    return this.x;  
};

Position.prototype.getY = function(){
    return this.y  
};

module.exports = Position;