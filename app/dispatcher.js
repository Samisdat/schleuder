var fs = require('fs');

var q = require('q');

var couch = require('./utils/couch');


var Image = require('../app/image');

var Cache = require('./utils/cache');
//var LiquidScaling = require('./liquid-scaling/index');


var actionsModules = {};
actionsModules['open-remote'] = require('./actions/open-remote');
actionsModules['resize'] = require('./actions/resize');
actionsModules['liquid-scaling'] = require('./actions/liquid-scaling');

var Dispatcher = function(request) {

    this.domain = 'http://schleuder.dev.pertz.eu';

    this.request = request;

    this.couchDbDoc = undefined;

    this.cacheDir = this.request.app.get('cache dir');
    this.cache = new Cache(request.originalUrl, this.cacheDir);

    this.actions = [];

};

Dispatcher.prototype.getCouchDbDoc = function(){
    return this.couchDbDoc;
};

Dispatcher.prototype.getImageUrl = function(){

	var imageUrl = this.request.params[2];

	return imageUrl;
};

Dispatcher.prototype.getUrlParameters = function(){

	var urlParameters = {};

	if(0 === this.request.params.length){
		return urlParameters;
	}

	var rawUrlParameters = this.request.params[1];

	rawUrlParameters = rawUrlParameters.split('/');

	for(var i = 0, x = rawUrlParameters.length; i < x; i += 2){
		urlParameters[rawUrlParameters[i]] = rawUrlParameters[(i + 1)];
	}

	return urlParameters;

};

Dispatcher.prototype.getActionsQueue = function(){
    var pre = ['open-remote'];

    var action = this.request.params[0];

    var post = [];

    return pre.concat(action).concat(post);
};

Dispatcher.prototype.action = function(){

	var deferred = q.defer();

    var actions = this.getActionsQueue();

    console.log(actions);

    var image = new Image(this.getImageUrl(), this.getUrlParameters());

    var that = this;

    actionsModules['open-remote'](image)
    .then(actionsModules['resize'])
    .then(function(image){
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
