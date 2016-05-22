var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, response, next) {

	var ip = 	req.headers['x-forwarded-for'] || 
     			req.connection.remoteAddress || 
     			req.socket.remoteAddress ||
     			req.connection.socket.remoteAddress;
    var queryString = "http://ip-api.com/json/" + ip; 
    
    
	http.get(queryString, function(res){
		res.on("data", function(data){
			response.send(data.toString());
		});
		res.resume()
		}).on('error', function(err){
			console.log(err);
			response.json(data);
	});
});

router.get('/:city', function(req, response, next){
	console.log(req.params.city);
	var city = req.params.city;
	var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
	var queryString = "http://api.openweathermap.org/data/2.5/weather?q="+ city  + ",russia" + id;
	console.log(queryString);
	
	http.get(queryString, function(res){
		res.on("data", function(data){
			console.log(data);
			response.send(data.toString());
		});
		res.resume()
		}).on('error', function(err){
			console.log(err);
			response.json(data);
	});
	
	
	
});

module.exports = router;
