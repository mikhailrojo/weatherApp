var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {

	var ip = 	req.headers['x-forwarded-for'] || 
     			req.connection.remoteAddress || 
     			req.socket.remoteAddress ||
     			req.connection.socket.remoteAddress;
    var queryString = "http://ip-api.com/json/" + ip; 
    
    
http.get(queryString, function(res){
	res.on("data", function(data){
		console.log(data);
		res.json(data);
	});
	res.resume()
}).on('error', function(err){
	console.log(err);
	res.json(data);
});




});

module.exports = router;
