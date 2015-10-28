/*global module */

var jsinspect = {
      options: {
        threshold:   30,
        diff:        true,
        identifiers: false,
        failOnMatch: true,
        suppress:    100,
        reporter:    'default',
        configFile:  '.jsinspectrc'
      },
      src: [
        'app/**/*.js',
        'test/**/*.js',
      ]

};



module.exports = jsinspect;
