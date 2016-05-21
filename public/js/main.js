angular.module('weatherApp', ['ngCookies'])
	.config(function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
			
	})
	.controller('weatherCtrl', function(geo, $scope, $http, $cookies){
		var positionStored = $cookies.getObject('weather') || null;
			console.log(positionStored);
			if(!positionStored){
				
					var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
					var query = "http://ip-api.com/json/?fields=country,city";
					$http.get(query)
						.then(function(res){
							console.log(res.data.city, "все гуд");
							console.log(res.data.country, "все гуд");
							
							var weatherQuery = "http://api.openweathermap.org/data/2.5/weather?q="+ res.data.city  + "," + res.data.country+ id;
							$http.get(weatherQuery)
								.then(function(res){
										console.log("сделали запрос на сервер");
										console.log(res.data);
										var expiryDate =  new Date(new Date().valueOf() + 1000*60*5)
										$cookies.putObject('weather', res.data, {expires: expiryDate });
										$scope.mi = res.data;
										
								}, function(res){
									console.log(res, "ошибка");
								});
							
						},function(){
							console.log(res, "ошибка");
						})
					
				
			} else{
				$scope.mi = positionStored;
				console.log("Информацию о погоде берем из кукисов");
			}

	
	})
	.factory('geo', function($http){
		
		return function(){
					console.log("result = ", result);
			
		}
		
	});


