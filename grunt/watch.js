/*global module */

var watch = {
	sass: {
		files: [
			'assets/scss/**/*.scss'
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
