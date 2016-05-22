angular.module('weatherApp', ['ngCookies', 'ngAnimate'])
	.config(function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	})
	.controller('weatherCtrl', function($scope, $cookies){
		$scope.panels = $cookies.getObject('previousQueries') || [];
		var now = new Date();
		var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
		$scope.findWeather = function(chosenCity){
			
			$scope.panels = $cookies.getObject('previousQueries') || [];
			$scope.panels.push(chosenCity.name);
			$cookies.putObject('previousQueries', $scope.panels, { expires: oneYearCookie});
			$scope.chosenCity.name = "";
		}
	})
	
	.directive("cityWeather", function($http, $cookies){
	
		function link(scope, element, attr){
			
			var cross = element.children().children()[0];
			var cookiesArray = $cookies.getObject('previousQueries');
			var now = new Date();
			var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
			
			element.on("mousedown", function(e){
				var cookiesArray = $cookies.getObject('previousQueries');	
				console.log(cookiesArray);
				
				
				if(e.target == cross ){
					console.log(cookiesArray);
					cookiesArray.splice(cookiesArray.indexOf(attr.city), 1);
					console.log(cookiesArray);
					$cookies.putObject('previousQueries', cookiesArray, { expires: oneYearCookie});
					element.remove();
					console.log(cookiesArray);
				}
			});
			
			var positionStored = $cookies.getObject(attr.city) || null;
			if(!positionStored){
					var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
					var query = "http://ip-api.com/json/?fields=country,city";
					$http.get(query)
						.then(function(res){
							var city = attr.city || res.data.city;
							var weatherQuery = "http://api.openweathermap.org/data/2.5/weather?q="+ city  + "," + res.data.country+ id;
							$http.get(weatherQuery)
								.then(function(res){
										var expiryDate =  new Date(new Date().valueOf() + 1000*60*5)
										$cookies.putObject(city, res.data, {expires: expiryDate });
										scope.mi = res.data;
										
								}, function(res){
									console.log(res, "ошибка");
								});
							
						},function(){
							console.log(res, "ошибка");
						})
					
				
			} else{
				scope.mi = positionStored;
			}
		scope.$on('$destroy', function(){
					element.remove();
				});
		}
		
		return {
			restrict : 'E',
			templateUrl :'weather',
			link: link
		}
	})



