/*global __dirname */

var crypto = require('crypto');
var fs = require('fs');

var q = require('q');
var mkdirp = require('mkdirp');

var couch = require('./couch.js');

var Cache = function(requestUrl, cacheDir){

    this.requestUrl = requestUrl;
    this.cacheDir = cacheDir;

    this.hash = undefined;

};

Cache.prototype.getHash = function(){

    if(undefined !== this.hash){
        return this.hash;
    }

    var md5sum = crypto.createHash('md5');
    this.hash = crypto.createHash('md5').update(this.requestUrl).digest("hex");

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

    var file = this.getFileName();

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
    });

    return deferred.promise;
};

Cache.prototype.getFileName = function(){
    var hash = this.getHash();

    var fileName = [];

    for(var i = 0, x = hash.length; i < x; i += 1){
        fileName.push(hash[i]);
        if(2 === i % 3){
            fileName.push('/');
        }
    }

    return this.cacheDir + '/' + fileName.join('');
};


Cache.prototype.writeFile = function(image){
	var deferred = q.defer();

    var fileName = this.getFileName();

    var path = fileName.split('/');
    path = path.slice(0, (path.length - 1));
    path = path.join('/');

    mkdirp(path, function (err) {
        if (err){
             deferred.reject(err);
        }

        image.getCtx().canvas.toBuffer(function(error, buffer){
            if(error){
                deferred.reject(error);
                return;
            }

            fs.writeFile(fileName, buffer, function(error){
                if(error){
                    deferred.reject(error);
                    return;
                }
                deferred.resolve(image);
            });
        });

    });

    return deferred.promise;
};

Cache.prototype.createCouch = function(image){
    	var deferred = q.defer();

    var couchDbDoc = {
        type:'image',
        //hash:this.getHash(),
        fileName:this.getFileName(),
        imageUrl: image.getImageUrl(),
        width:image.getWidth(),
        height:image.getHeight(),
        mimeType:image.getMimeType(),
        requests:1
    };

    couch.post('/schleuder', couchDbDoc).then(function(data){
        deferred.resolve(image);
    }).fail(function(data){
        deferred.reject();
    });

    	return deferred.promise;
};

Cache.prototype.set = function(image){
	var deferred = q.defer();

    var write = this.writeFile(image);

    var that = this;
    write.then(function(image){
        return that.createCouch(image);
    }).then(function(image){
        deferred.resolve(image);
    });

	return deferred.promise;
};

module.exports = Cache;
