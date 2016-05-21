(function(){
	if("geolocation" in navigator){
		navigator.geolocation.getCurrentPosition(function(position){
			console.log('широта ' + position.coords.latitude);
			console.log('долгота ' + position.coords.longitude);
			
			var json = JSON.stringify({
				longitude: position.coords.longitude,
				latitude : position.coords.latitude
			});
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/geo', true);
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xhr.send(json);
			
			xhr.onreadystatechange = function(){
				if(xhr.readyState !=4) return;
				
				if(xhr.status != 200){
					console.log('Статус ' + xhr.status + ':' + xhr.statustext);
				} else {
					console.log(xhr.responseText);
				}
				
			}
		});
		
	} else{
		console.log('гео нет');
	}
})();
