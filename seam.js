var seamCarver = require('./schleuder_modules/actions/seamcarver');
var lwip = require('lwip');

lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(err, image){

	seamCarver(image);

});
