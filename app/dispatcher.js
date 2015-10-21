var q = require('q');

var couch = require('../app/couch');

var Cache = require('./default_actions/cache');



var Dispatcher = function(request, response, next) {
    this.couchDbDoc;

    this.cache = new Cache(request);

};

Dispatcher.prototype.getCouchDbDoc = function(){
    return this.couchDbDoc;
};

Dispatcher.prototype.isCached = function(){

	var deferred = q.defer();

    var isCached = this.cache.get();

    var that = this;

    isCached.fail(function(){
        deferred.reject();
    })
    isCached.then(function(couchDbDoc){
        that.couchDbDoc  = couchDbDoc;
        deferred.resolve();
    })

    return deferred.promise;

};

Dispatcher.prototype.logRequest = function(){

    if(undefined === this.couchDbDoc._id){
        return;
    }

    if(undefined === this.couchDbDoc.requests){
        this.couchDbDoc.requests = 0;
    }

    this.couchDbDoc.requests += 1;

    couch.put('/schleuder/' + this.couchDbDoc._id, this.couchDbDoc);

};



module.exports = Dispatcher;
