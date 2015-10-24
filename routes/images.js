var express = require('express');
var router = express.Router();

var couch = require('../app/couch.js');

var Dispatcher = require('../app/dispatcher');

var LiquidScaling = require('../app/liquid-scaling/index');

var cacheDir = '/var/www/schleuder/cache/';

var crypto = require('crypto');

router.get('/local-image.jpg', function(req, res, next) {

  var filename = '/var/www/schleuder/raw-images/ballon-medium.jpg';

  	res.sendFile(filename);

});

router.get('/*', function(request, response, next) {
    var dispatcher = new Dispatcher(request, response, next);
    var isCached = dispatcher.isCached();

    isCached.fail(function(){
        next();
    });

    isCached.then(function(){
        var couchDbDoc = dispatcher.getCouchDbDoc();
        var mimeType = couchDbDoc.mimeType;

        response.type(mimeType);
        response.sendFile(couchDbDoc.fileName);

    });


});

router.get('^/:action//*//:image$', function(request, response, next){

    var hash = 'foo';

    var imageUrl = 'http://c2.staticflickr.com/6/5632/22152957371_ccd82d8593_c.jpg';
    imageUrl = 'http://schleuder.dev.pertz.eu/local-image.jpg';

    if(undefined === request.params.action || undefined === request.params.image){
        next();
        return;
    }

    var dispatcher = new Dispatcher(request, response, next);
    dispatcher.action();
    return;
    dispatcher.open(imageUrl).then(function(data){

      var liquidScaling = new LiquidScaling(data.ctx);
      var heatMapCtx = liquidScaling.resize({width:250,height:180});
      heatMapCtx.canvas.toBuffer(function(err, buf){

        dispatcher.write(buf);
        fs.writeFile(cacheDir + hash, buf, function(){
            response.type(data.mime);
            response.sendFile(cacheDir + hash);


        });
      });


    }).fail(function(data){
        console.log(data)
    });

});

router.get('/*', function(request, response, next){
    response.send('404');
});


module.exports = router;
