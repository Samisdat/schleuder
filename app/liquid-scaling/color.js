var Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.rgb = function(){
    return{
        r:this.r,
        g:this.g,
        b:this.b  
    };  
};

Color.prototype.rgba = function(){
    return{
        r:this.r,
        g:this.g,
        b:this.b,
        a:this.a  
    };  
};

module.exports = Color;