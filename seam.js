var seamCarver = require('./app/seamcarver');
var lwip = require('lwip');

/*
fillMatrix: 2009ms
generateHeatMap: 479ms
generateSeams: 257ms
drawImage: 47346ms
*/
//lwip.open('/var/www/schleuder/raw-images/ballon-small.jpg', function(err, image){
lwip.open('/var/www/schleuder/raw-images/ballon.jpg', function(err, image){
//lwip.open('/var/www/schleuder/raw-images/ballon-medium.jpg', function(err, image){
//lwip.open('/var/www/schleuder/raw-images/laterne.jpg', function(err, image){
	var carved = seamCarver(image);

	//carved.resize({width:350, height:500});
	//var seams = carved.initSeams();

	carved.getSeams();
	//carved.getHeatMap();

});


