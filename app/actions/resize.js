/*global module */

var q = require('q');
var Canvas = require('canvas');
var Image = Canvas.Image;

var resize = function(image){

        var deferred = q.defer();

        var params = image.getActionParams();

        if(undefined === params.width){
            params.width = image.getWidth();
        }

        if(undefined === params.width){
            params.height = image.getHeight();
        }

        params.width = parseInt(params.width,10);
        params.height = parseInt(params.height,10);

        var img = new Image;
        img.onload = function() {
            var width = img.width;
            var height = img.height;

            var canvas = new Canvas(params.width, params.height);
            var ctx = canvas.getContext('2d');

            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(img, 0, 0, params.width, params.height);
            image.setCtx(ctx);

            deferred.resolve(image);

        };

        img.src = image.getCtx().canvas.toBuffer();

        return deferred.promise;

};

module.exports = resize;
