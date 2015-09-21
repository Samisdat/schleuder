/*global module */

var watch = {
	sass: {
		files: [
			'public/scss/**/*.scss'
		],
		tasks: [
			"development"
		],
		options: {
			nospawn: true
		}
	}
};

module.exports = watch;
