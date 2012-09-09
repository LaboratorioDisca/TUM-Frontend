var TUMCore = function(params) {
	var tilesURL=params.tilesURL;
	var url=params.url;

	// Data Structures
	var lines = {};
	var vehicleMarkers = {};
	var vehicleInstants = {};

	// Associated views
	var routesMainPanel = "#routes-main-panel";
	var routesListingPanel = "#routes-listing-panel";
	

	var initialize = function() {
		fetchLinesAndVehicles();
	}	
	
	var fetchLinesAndVehicles = function() {
		$.getJSON(webServiceURL+"transports/8/lines?callback=?", function(data){
			for(var idx in data) {
				var lineId = data[idx].id;
			
				delete data[idx].id;
				lines[lineId] = data[idx];
			}
		});
	}

	var fetchVehicles = function() {
		$.getJSON(webServiceURL+"vehicles?callback=?", function(data){
			for(var idx in data) {
				var line = lines[data[idx].lineId];
				
				var myIcon = L.icon({
				    iconUrl: webServiceURL+'assets/images/'+line.simpleIdentifier+'.png',
				    iconSize: [32, 37]
				});
				
				var marker = L.marker([0,0], {icon: myIcon, title: "Vehiculo # "+data[idx].identifier }).addTo(map);
				var vehicleId = data[idx].id;
				
				vehicleMarkers[vehicleId] = marker;
				vehicleInstants[vehicleId] = null;
			}
		});
	}
  
	this.landing = function() {
		console.log('loaded landing');
		$(routesMainPanel).slideDown(400);
		$(routesListingPanel).hide();
	}
	
	this.routes = function() {
		console.log('viewing routes');
		
		$(routesMainPanel).slideUp(200);
		$(routesListingPanel).delay(400).slideDown(600);
	}
	
	initialize();
}

