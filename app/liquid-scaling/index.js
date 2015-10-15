var lwip = require('lwip');
var fs = require('fs');

var Canvas = require('canvas')
var Matrix = require('./matrix');

var fillMatrix = function(){

    this.matrix = new Matrix(this.ctx.canvas.width, this.ctx.canvas.height);

    var imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height).data;

    var width = this.ctx.canvas.width;

    var getPixel = function(x, y){
        var base = (y * width + x) * 4;
        return {
            r: imageData[base + 0],
            g: imageData[base + 1],
            b: imageData[base + 2],
            a: imageData[base + 3]
        };
    }

    for (var x = 0, width = this.matrix.getWidth(); x < width;  x += 1) {

        for (var y = 0, height = this.matrix.getHeight(); y < height;  y += 1) {
            var color = getPixel(x, y);
            this.matrix.setColor(y, x, color.r, color.g, color.b, color.a);
        }
    }

};

var LiquidScaling = function(canvasContext) {
    this.ctx = canvasContext;

    this.matrix;

    fillMatrix.call(this);

    this.matrix.generateHeatMap();
};


LiquidScaling.prototype.getHeatMap = function(){

    var heatMapCanvas = new Canvas(this.matrix.getWidth(), this.matrix.getHeight());
    var heatMapCtx = heatMapCanvas.getContext('2d');

    var maxHeat = this.matrix.getMaxHeat();

    var newImageData = [];

    var width = this.matrix.getWidth();

    var setPixel = function(x, y, color){
        var base = (y * width + x) * 4;
        newImageData[base + 0] = color.r;
        newImageData[base + 1] = color.g;
        newImageData[base + 2] = color.b;
        newImageData[base + 3] = 255;
    };

    for (var x = 0; x < this.matrix.getWidth(); x++) {

        for (var y = 0; y < this.matrix.getHeight(); y++) {

            var color = parseInt(this.matrix.getHeat(y, x) / maxHeat * 255, 10);
            setPixel(x, y, {r:color, g:color, b:color});
        }

    }

    var newImage = heatMapCtx.createImageData(this.matrix.getWidth(), this.matrix.getHeight());
    for (var i = 0; i < newImageData.length; i++) {
        newImage.data[i] = newImageData[i];
    }

    heatMapCtx.putImageData(newImage, 0, 0);

    return heatMapCtx;

};

LiquidScaling.prototype.resize = function(width){

        var target = this.matrix.getWidth() - width;
        this.matrix.generateSeams()

        while(this.matrix.getWidth() > width){

            this.matrix.generateHeatMap();
            this.matrix = this.matrix.getReduced(width);

        }

        var heatMapCanvas = new Canvas(this.matrix.getWidth(), this.matrix.getHeight());
        var heatMapCtx = heatMapCanvas.getContext('2d');

        var maxHeat = this.matrix.getMaxHeat();

        var newImageData = [];

        var width = this.matrix.getWidth();

        var setPixel = function(x, y, color){
            var base = (y * width + x) * 4;
            newImageData[base + 0] = color.r;
            newImageData[base + 1] = color.g;
            newImageData[base + 2] = color.b;
            newImageData[base + 3] = 255;
        };

        for (var x = 0; x < this.matrix.getWidth(); x++) {

            for (var y = 0; y < this.matrix.getHeight(); y++) {

                var color = this.matrix.getColor(y, x);
                setPixel(x, y, color);
            }

        }

        var newImage = heatMapCtx.createImageData(this.matrix.getWidth(), this.matrix.getHeight());
        for (var i = 0; i < newImageData.length; i++) {
            newImage.data[i] = newImageData[i];
        }

        heatMapCtx.putImageData(newImage, 0, 0);

        return heatMapCtx;

    };



module.exports = LiquidScaling;
