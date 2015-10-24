var express = require('express');
var router = express.Router();

var Dispatcher = require('../app/dispatcher');

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

    var imageUrl = 'http://schleuder.dev.pertz.eu/local-image.jpg';

    if(undefined === request.params.action || undefined === request.params.image){
        next();
        return;
    }

    var dispatcher = new Dispatcher(request, response, next);
    dispatcher.action();

});

router.get('/*', function(request, response, next){
    response.send('404');
});


module.exports = router;
