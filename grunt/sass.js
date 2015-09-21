/*global module */

var sass = {
    development: {
        options: {
            sourceMap: true
        },
        files: {
            'public/css/<%= pkg.name %>.css' : 'public/scss/<%= pkg.name %>.scss',
        }
    },
    production: {
        options: {
            sourceMap: false,
            outputStyle:'compressed'
        },
        files: {
          'public/css/<%= pkg.name %>.min.css' : 'public/scss/<%= pkg.name %>.min.scss',
        }
    }
};

module.exports = sass;
