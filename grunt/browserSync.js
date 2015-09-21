/*global module */

var browserSync = {
    dev: {
        files: {
            src: [
                'public/css/<%= pkg.name %>.css'
            ]
        },
        injectChanges: true,
        options: {
            watchTask: true
        }
    }
};

module.exports = browserSync;
