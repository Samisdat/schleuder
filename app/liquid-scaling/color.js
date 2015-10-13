var Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.getRgb = function(){
    return{
        r:this.r,
        g:this.g,
        b:this.b
    };
};

Color.prototype.setRgb = function(r, g, b){

    this.r = r;
    this.g = g;
    this.b = b;

};


Color.prototype.getRgba = function(){
    return{
        r:this.r,
        g:this.g,
        b:this.b,
        a:this.a
    };
};

Color.prototype.setRgba = function(r, g, b, a){

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

};

module.exports = Color;
