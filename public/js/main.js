angular.module('weatherApp', [])
	.config(function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
			
	})
	.controller('weatherCtrl', function(geo, $scope, $http){
		console.log('контроллер');	
		var result;
			if("geolocation" in navigator){
				navigator.geolocation.getCurrentPosition(function(position){

					var longitude = position.coords.longitude;
					var latitude = position.coords.latitude;
					var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
					//var query = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude + id;
					var query = "http://ip-api.com/json/?fields=country,city";
					
					
					$http.get(query)
						.then(function(res){
							console.log(res.data.city, "все гуд");
							console.log(res.data.country, "все гуд");
							
							var weatherQuery = "http://api.openweathermap.org/data/2.5/weather?q="+ res.data.city  + "," + res.data.country+ id;
							$http.get(weatherQuery)
								.then(function(res){
										console.log(res.data);
										$scope.mi = res.data;
										
								}, function(res){
									console.log(res, "ошибка");
								});
							
						},function(){
							console.log(res, "ошибка");
						})
					
				});
			} else{
				console.log('гео нет');
			}

	
})
	.factory('geo', function($http){
		
		return function(){
					console.log("result = ", result);
			
		}
		
	});


