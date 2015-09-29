/*global module */

var jshint = {
	options: {
		curly: true,
		eqeqeq: true,
		undef:true,
		strict:true,
		browser: true,
		jquery: true,
	},
    frontend:{
        src:[
            'public/js/**/*.js'
        ]
    },
    server:{
        src:[
            'routes/**/*.js',
            'schleuder_modules/**/*.js'
        ],
		options: {
			curly: true,
			eqeqeq: true,
			undef:true,
			strict:false,
			browser: false,
			jquery: false,
			globals: {
			    "require": true,
			    "module": true
		  	}			
		}        
    },
	gruntfiles:{
		src:[
			'Gruntfile.js', 'grunt/*js'
		]
	}

};



module.exports = jshint;
