/*global module */

var q = require('q');

var LiquidScaling = require('liquid-scaling');


var liquidScalingAction = function(image){

        var deferred = q.defer();

        var liquidScaling = new LiquidScaling(image.getCtx());

        var params = image.getActionParams();

        if(undefined === params.width){
            params.width = image.getWidth();
        }

        if(undefined === params.width){
            params.width = image.getHeight();
        }

        image.setWidth(params.width);
        image.setHeight(params.height);

        var resized = liquidScaling.resize(params);

        image.setCtx(resized);

        deferred.resolve(image);

        return deferred.promise;

};

module.exports = liquidScalingAction;
