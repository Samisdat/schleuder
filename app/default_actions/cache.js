/*global __dirname */

var crypto = require('crypto');
var fs = require('fs');

var q = require('q');

var couch = require('../couch.js');

var Cache = function(request){
    this.request = request;

    this.hash;

};

Cache.prototype.getHash = function(){

    if(undefined !== this.hash){
        return this.hash;
    }

    var md5sum = crypto.createHash('md5');
    this.hash = crypto.createHash('md5').update(this.request.originalUrl).digest("hex");

	return this.hash;

};

Cache.prototype.getCouch = function(){

	var deferred = q.defer();

    var hash = this.getHash();

    var checkCache = couch.get('/schleuder/_design/image/_view/hash', {
        key: hash,
        include_docs: true
    });

    checkCache.fail(function(json){
        deferred.reject();
    });

    checkCache.then(function(json){

        if(undefined === json.rows || 1 !== json.rows.length || undefined === json.rows[0].doc){
            deferred.reject();
        }
        else{
            deferred.resolve(json.rows[0].doc);
        }

    });

    return deferred.promise;

};

Cache.prototype.file = function(couchDbDoc){
	var deferred = q.defer();

    var file = this.request.app.get('cache dir') + '/' + this.getHash();

    fs.exists(file, function (exists) {
        if(true === exists){
            deferred.resolve(couchDbDoc);
        }
        else{
            deferred.reject();
        }
    });
    return deferred.promise;
};


Cache.prototype.get = function(){

	var deferred = q.defer();

    // disadvantage of this "new" thing
    var that = this;
    this.getCouch()
    .then(function(couchDbDoc){
        return that.file(couchDbDoc);
    })
    .then(function(couchDbDoc){
        deferred.resolve(couchDbDoc);
    })
    .fail(function (error) {
        deferred.reject();
    })

    return deferred.promise;
};

Cache.prototype.set = function(){
	var deferred = q.defer();
    return deferred.promise;
};

module.exports = Cache;
