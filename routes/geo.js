var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'ГЕОЛОКАЦИИ' });
  res.json({misha : "Stepanov", tima : true});
});

router.post('/', function(req, res, next){
	console.log('пост получен ' + req.body);
	
	var longitude = req.body.longitude;
	var latitude = req.body.latitude;
	var id =  '&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
	
	var query= "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude + id;
	
	http.get(query, function(res){
	res.on('data', function(data){
		console.log(data.toString());
	});
		
		res.resume();
	}).on('error', function(e){
			console.log(e);
		})
	
	res.json(query)
});

module.exports = router;
