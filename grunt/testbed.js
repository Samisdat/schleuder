var Flickr = require("flickrapi");

var flickrOptions = {
  api_key: "3e3d777615143659a269f377fb7cda1b",
  secret: "f870aea40c6ef8d0"
};

module.exports = function(grunt){
    grunt.registerTask('testbed', function(){

        var done = this.async();

        Flickr.authenticate(flickrOptions, function(error, flickr) {

            flickr.photos.search({
              text: "red+panda"
            }, function(err, result) {

                if(err) {
                    throw new Error(err);
                }
                console.log(result)
            })

        });

    });


};

