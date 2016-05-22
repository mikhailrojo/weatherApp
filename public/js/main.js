angular.module('weatherApp', ['ngCookies'])
	.config(function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	})
	.controller('weatherCtrl', ['$scope', '$cookies', 'toTranslit', function($scope, $cookies, toTranslit){
		$scope.panels = $cookies.getObject('previousQueries') || [];
		var now = new Date();
		var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
		$scope.findWeather = function(chosenCity){
			$scope.panels = $cookies.getObject('previousQueries') || [];
			chosenCity = toTranslit(chosenCity);
			$scope.panels.push(chosenCity);
			$cookies.putObject('previousQueries', $scope.panels, { expires: oneYearCookie});
			$scope.chosenCity= "";
		}
	}])
	
	.directive("cityWeather", function($http, $cookies){
		function link(scope, element, attr){
			var cross = element.children().children()[0];
			var cookiesArray = $cookies.getObject('previousQueries');
			var now = new Date();
			var oneYearCookie = new Date(now.getFullYear()+2, now.getMonth(), now.getDay());
			
			element.on("mousedown", function(e){
				var cookiesArray = $cookies.getObject('previousQueries');	
				if(e.target == cross){
					cookiesArray.splice(cookiesArray.indexOf(attr.city), 1);
					$cookies.putObject('previousQueries', cookiesArray, { expires: oneYearCookie});
					element.remove();
				}
			});
			var positionStored = $cookies.getObject(attr.city) || null;
			if(!positionStored){
					$http.get('/geo')
						.then(function(res){
							var city = attr.city || res.data.city;
							$http.get('/geo/:'+city)
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
	.factory("toTranslit", function(){
	return function(text){
		return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
	        function (all, ch, space, words, i) {
	            if (space || words) {
	                return space ? '-' : '';
	            }
	            var code = ch.charCodeAt(0),
	                index = code == 1025 || code == 1105 ? 0 :
	                    code > 1071 ? code - 1071 : code - 1039,
	                t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
	                    'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
	                    'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
	                    'shch', '', 'y', '', 'e', 'yu', 'ya'
	                ]; 
	            return t[index];
	        });
	    }
	})



