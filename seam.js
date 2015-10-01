var seamCarver = require('./schleuder_modules/actions/seamcarver');
var lwip = require('lwip');

lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(err, image){

	var carved = seamCarver(image);

	//carved.resize({width:350, height:500});
	//carved.getHeatMap();
	carved.getSeams();

});
