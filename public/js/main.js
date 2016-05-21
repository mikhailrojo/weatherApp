angular.module('weatherApp', ['ngCookies'])
	.config(function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	})
	.controller('weatherCtrl', function($scope, $cookies){
		$scope.panels = $cookies.getObject('previousQueries') || [];
		var now = new Date();
		var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
		console.log($scope.panels);
		
		$scope.findWeather = function(chosenCity){
			$scope.panels.push(chosenCity);
			console.log($scope.panels);	
			$cookies.putObject('previousQueries', $scope.panels, { expires: oneYearCookie});
		}
	})
	.directive("cityWeather", function($http, $cookies){
	
		function link(scope, element, attr){
		
			var cross = element.children().children()[0];
			var cookiesArray = $cookies.getObject('previousQueries');
			var now = new Date();
			var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
			element.on("mousedown", function(e){
				if(e.target == cross ){
					
					var cityScope = scope.$parent.panels;
					cookiesArray.splice(cookiesArray.indexOf(attr.city), 1);
					//console.log(cookiesArray);
					$cookies.putObject('previousQueries', cookiesArray, { expires: oneYearCookie});
					cityScope = cookiesArray;
					
					

				
				}
			});
			
			var positionStored = $cookies.getObject(attr.city) || null;
		// устанавливаем данные о погоде в Куки, которые истекают каждый 5 минут.
		// Если они истекли то делается запрос на сервер
			//console.log(positionStored);
			if(!positionStored){
					
					var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
					var query = "http://ip-api.com/json/?fields=country,city";
					$http.get(query)
						.then(function(res){
							var city = attr.city || res.data.city;
							var weatherQuery = "http://api.openweathermap.org/data/2.5/weather?q="+ city  + "," + res.data.country+ id;
							$http.get(weatherQuery)
								.then(function(res){
										//console.log("сделали запрос на сервер");
										var expiryDate =  new Date(new Date().valueOf() + 1000*60*5)
										$cookies.putObject(city, res.data, {expires: expiryDate });
										//console.log($cookies.getAll());
										scope.mi = res.data;
										
								}, function(res){
									console.log(res, "ошибка");
								});
							
						},function(){
							console.log(res, "ошибка");
						})
					
				
			} else{
				scope.mi = positionStored;
				//console.log("Информацию о погоде берем из кукисов");
			}

		}
		
		return {
			restrict : 'E',
			templateUrl :'weather',
			link: link
		}
	})



