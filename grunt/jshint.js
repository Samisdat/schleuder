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
	gruntfiles:{
		src:[
			'Gruntfile.js', 'grunt/*js'
		]
	}

};



module.exports = jshint;
