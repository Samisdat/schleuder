/*global module */

var sass = {
    development: {
        options: {
            sourceMap: true
        },
        files: {
            'assets/css/<%= pkg.name %>.css' : 'assets/scss/<%= pkg.name %>.scss',
        }
    },
    production: {
        options: {
            sourceMap: false,
            outputStyle:'compressed'
        },
        files: {
          'assets/css/<%= pkg.name %>.min.css' : 'assets/scss/<%= pkg.name %>.min.scss',
        }
    }
};

module.exports = sass;
