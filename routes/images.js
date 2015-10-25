var express = require('express');
var router = express.Router();

router.get('/local-image.jpg', function(req, res, next) {

  var filename = '/var/www/schleuder/raw-images/ballon-medium.jpg';

  	res.sendFile(filename);

});

var Cache = require('../app/utils/cache');

router.get('/*', function(request, response, next){

    next();
    return;

    var cache = new Cache(request.originalUrl, request.app.get('cache dir'));

    var isCached = cache.get();

    isCached.fail(function(){
        next();
    });

    isCached.then(function(couchDbDoc){
        var mimeType = couchDbDoc.mimeType;

        response.type(mimeType);
        response.sendFile(couchDbDoc.fileName);
    });

});

var Dispatcher = require('../app/dispatcher');

router.get('^/:action//*//:image$', function(request, response, next){

    var imageUrl = 'http://schleuder.dev.pertz.eu/local-image.jpg';

    if(undefined === request.params.action || undefined === request.params.image){
        next();
        return;
    }

    var dispatcher = new Dispatcher(request);

    dispatcher.action().then(function(image){
        image.getCtx().canvas.toBuffer(function(err, buf){
            response.type(image.getMimeType());
            response.send(buf);
        });

    });

});

router.get('/*', function(request, response, next){
    response.send('404');
});


module.exports = router;
