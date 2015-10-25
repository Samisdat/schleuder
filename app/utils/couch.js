(function () {

    'use strict';

    var couch_config = require('../../config/couchdb.js');

    var Q = require('q');

    var http = require('http');

    var querystring = require('querystring');

	/**
	 * @TODO this is exactly the code from 3 years ago
	 */
    var get_parameter = function (data) {

        if (data === undefined || data === false) {
            return '';
        }

		// can only convert key value objects
		if (typeof data !== 'object' || typeof data.length === 'number') {
			return '';
		}

		for(var key in data)
		{
			//@todo Not everything is a string
			if(typeof data[key] === 'string')
			{
				data[key] = '"' + data[key] + '"';
			}
			// Heißt zwar object, ist aber nur für array geeignet
			else if(typeof data[key] === 'object'){
				var sub = [];
				for(var inner in data[key]){
					if(typeof data[key][inner] === 'string'){
						sub.push('"' + data[key][inner] + '"');
					}
					else if(typeof data[key][inner] === 'number'){
						sub.push(data[key][inner]);
					}
				}
				data[key] = '[' + sub.join(',') + ']';
			}
			else if(typeof data[key] === 'boolean'){
				data[key] = data[key];
			}

		}
		data = '?' + querystring.stringify(data);
		return data;
	};

	/**
	 *
	 */
	var request_options = function(path, method, data){

		var deferred = Q.defer();

		method = method.toUpperCase();

		data = (data === undefined) ? false : data;


		if(method !== 'GET' && method !== 'POST' && method !== 'PUT' && method !== 'DELETE'){
			deferred.reject({error:'unsupported method'});
		}

		var opt = {
			host: couch_config.host,
			port: couch_config.port,
			path: path,
			method: method
		};

        if(undefined !== couch_config.admin_user && undefined !== couch_config.admin_pass){
            opt.auth = couch_config.admin_user +':'+ couch_config.admin_pass;
        }

		if(data !== false && (method === 'POST' || method === 'PUT')){
			opt.headers = {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length
			};
		}

		if(opt.path.lastIndexOf(':uuid') === -1 ){
			deferred.resolve(opt);
		}
		else{
			var unique_id = uuid();
			unique_id.then(function(id){
				opt.path = opt.path.replace(':uuid', id);
				deferred.resolve(opt);
			});
		}

		return deferred.promise;
	};

	var request = function(path, method, data){
		var deferred = Q.defer();

		method = method.toUpperCase();

		data = (data === undefined) ? false : data;

		//@TODO check that couch only wants get params when using methid get
		if(method === 'GET'){
			data = get_parameter(data);
			path = path + data;
		}
		var options = request_options(path, method, data);

		options.fail(function(){
			deferred.reject({
				msg: 'can not resolve requestoptions'
			});
		});

		options.then(function(options){

			var req = http.request(options, function(res) {

				res.setEncoding('utf8');
				var body = '';
				res.on('data', function (chunk) {
					body += chunk;
				});

				res.on('end', function () {
					try{
						var json = JSON.parse(body);
						if(json.error !== undefined){
							deferred.reject(json);
						}
						else{
							deferred.resolve(json);
						}
					}
					catch(e){
						deferred.reject('invalid_json');
					}
				});
			});

			req.on('error', function(e) {
				deferred.reject(e.message);
			});

			if(data !== false && (method === 'POST' || method === 'PUT')){
				req.write(JSON.stringify(data));
			}

			req.end();
		});

		return  deferred.promise;


	};


	/**
	 *
	 */
	var get = function(path, data){

		return  request(path, 'GET', data);

	};

	/**
	 * get uuids form couch server and fetch some new when to less
	 */
	var uuid = function(){
		var deferred = Q.defer();

		var get_ids = get('/_uuids', {count: 1});
		get_ids.then(function(json){
			deferred.resolve(json.uuids.shift());
		});
		return  deferred.promise;
	};

	/**
	 *
	 * It is recommended that you avoid POST when possible
	 * http://wiki.apache.org/couchdb/HTTP_Document_API#POST
	 */
	var post = function(path, data){
		return  request(path, 'POST', data);
	};

	var put = function(path, data){
		return  request(path, 'PUT', data);
	};

	var del = function(path){

		var slashes = path.split('/');
		//@TODO this will delete a database, validate path starting with a slash
		if(slashes.length === 2){
			return  request(path, 'DELETE');
		}
		else{
			// deleting a doc will only work when _rev is given
			var deferred = Q.defer();
			var doc = get(path);
			doc.then(function(json){
				var delete_doc = request(path + '?rev=' + json._rev, 'DELETE');
				delete_doc.then(function(json){
					if(json.ok === true){
						deferred.resolve(json);
					}
				});
			});
			return  deferred.promise;
            }
    };

    module.exports = {
		get_parameter:get_parameter,
		request_options:request_options,
		uuid: uuid,
		get: get,
		post: post,
		put: put,
		del:del
	};
}());
