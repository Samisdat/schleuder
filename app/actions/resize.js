/*global module */

var q = require('q');
var Canvas = require('canvas');
var Image = Canvas.Image;

var resize = function(image){

        var deferred = q.defer();

        var params = image.getActionParams();

        if(undefined === params.width && undefined === params.height){
            deferred.reject();
        }

        if(undefined !== params.width){
            params.width = parseInt(params.width,10);
        }

        if(undefined !== params.height){
            params.height = parseInt(params.height,10);
        }
    
        var img = new Image;
        img.onload = function() {

            // use ratio
            if(undefined === params.width || undefined === params.height){
                var width = img.width;
                var height = img.height;
    
                if(undefined === params.width){
                    params.width = Math.floor(width/height * params.height);
                }
                else if(undefined === params.height){
                    params.height = Math.floor(height/width * params.width);
                }
            }
            console.log(params)

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
