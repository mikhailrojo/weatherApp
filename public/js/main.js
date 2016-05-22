angular.module('weatherApp', ['ngCookies'])
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
				if(e.target == cross ){
					cookiesArray.splice(cookiesArray.indexOf(attr.city), 1);
					$cookies.putObject('previousQueries', cookiesArray, { expires: oneYearCookie});
					element.remove();
				}
			});
			
			var positionStored = $cookies.getObject(attr.city) || null;
			if(!positionStored){
					var id =  '&lang=ru&units=metric&APPID=ee7b44dbcbd8e281e70c9fd015b08a00';
					var query = "http://www.ip-api.com/json/?fields=country,city";

					$http.get('/geo')
						.then(function(res){
							console.log(res);
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
							
						},function(res){
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



