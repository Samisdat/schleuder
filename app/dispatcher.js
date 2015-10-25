var fs = require('fs');

var q = require('q');

var couch = require('../app/couch');


var Image = require('../app/image');

var Cache = require('./default_actions/cache');

var actionsModules = {};
actionsModules.open = require('../app/default_actions/open');
actionsModules.LiquidScaling = require('../app/liquid-scaling/index');

var Dispatcher = function(request) {

    this.domain = 'http://schleuder.dev.pertz.eu';

    this.request = request;

    this.couchDbDoc;

    this.cacheDir = this.request.app.get('cache dir');
    this.cache = new Cache(request.originalUrl, this.cacheDir);

    this.actions = [];

};

Dispatcher.prototype.getCouchDbDoc = function(){
    return this.couchDbDoc;
};

Dispatcher.prototype.getImageUrl = function(){

	var imageUrl = this.domain + '/' + this.request.params.image;

	return imageUrl;
};

Dispatcher.prototype.getUrlParameters = function(){

	var urlParameters = {};

	if(0 === this.request.params.length){
		return urlParameters;
	}

	var rawUrlParameters = this.request.params[0];

	rawUrlParameters = rawUrlParameters.split('/');

	for(var i = 0, x = rawUrlParameters.length; i < x; i += 2){
		urlParameters[rawUrlParameters[i]] = rawUrlParameters[(i + 1)];
	}

	return urlParameters;

};

Dispatcher.prototype.getActionsQueue = function(){
    var pre = ['open']

    var action = this.request.params.action;

    var post = ['writeToCache', 'log', 'send'];

    return pre.concat(action).concat(post);
};

Dispatcher.prototype.action = function(){

	var deferred = q.defer();

    var actions = this.getActionsQueue();

    var image = new Image(this.getImageUrl(), this.getUrlParameters());

    var that = this;

    actionsModules.open(image).then(function(image){
        var deferred = q.defer();

        var liquidScaling = new actionsModules.LiquidScaling(image.getCtx());

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

    }).then(function(image){
        return that.cache.set(image);
    }).then(function(image){
        deferred.resolve(image);
    });

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
