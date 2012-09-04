var webServiceURL = "http://132.248.51.251:9000/";
var tilesURL = "http://132.248.51.251:8888/v2/UNAMCU.json";

$(document).ready(function() {
	var coreInstance = new TUMCore({ tilesURL : tilesURL, url : webServiceURL });
	
	Path.map("#/").to(coreInstance.landing);
	Path.map("#/routes").to(coreInstance.routes);
	
	Path.root("#/");
	Path.listen();
	
	
	var map;
	var latlng = new L.LatLng(19.322675,-99.192080);
	
	var map = new L.Map('map').setView(latlng, 16);

  // Get metadata about the map from MapBox
  wax.tilejson(tilesURL, function(tilejson) {
      // Add MapBox Streets as a base layer
      map.addLayer(new wax.leaf.connector(tilejson));
  });
	
	/*wax.tilejson(tilesURL,
	  function(tilejson) {
	  map = new google.maps.Map(
	    document.getElementById('map'), {
					zoom: 15,
					center: latlng,
					maxZoom: 20,
					minZoom: 14,
					mapTypeId: google.maps.MapTypeId.HYBRID,
					mapTypeControl: false
				});

	  // Use this code to set a new layer as a baselayer -
	  // which means that it'll be on the bottom of any other
	  // layers and you won't see Google tiles
	  map.mapTypes.set('mb', new wax.g.connector(tilejson));
	  map.setMapTypeId('mb');

	  // Or use this code to add it as an overlay
	  // m.overlayMapTypes.insertAt(0, new wax.g.connector(tilejson));
	});*/
	
	var vehicleMarkers = {};
	var vehicleInstants = {};
	var lines = {};

	var retrieveVehicles = function() {
		// all vehicles
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
	
	$.getJSON(webServiceURL+"transports/8/lines?callback=?", function(data){
		for(var idx in data) {
			var lineId = data[idx].id;
			
			delete data[idx].id;
			lines[lineId] = data[idx];
		}
		retrieveVehicles();
	});

	
	function retrieveRecent() {
		$.getJSON(webServiceURL+"instants/minutesago/3?callback=?", function(data){
			for(var idx in data) {
				var vehicleMarker = vehicleMarkers[data[idx].vehicleId];
				if(vehicleMarker != undefined) {
					updateMarker(vehicleMarker, data[idx]);
				}
			}
		}).error(function() {
			appendErrorFor("unknown-error");
		});
	}

	setInterval(retrieveRecent, 4000);

	var updateMarker = function(marker, object) {
		
		if(!map.hasLayer(marker)) {
			marker.addTo(map);
		}
		
		marker.setLatLng(new L.LatLng(object.coordinate.lat, object.coordinate.lon));
		
		/*var date = new Date(object.createdAt).toLocaleDateString() +" - "+ new Date(object.createdAt).toLocaleTimeString();
		
		marker.setTitle("Velocidad: " + object.speed + "(km/h) Recibido: " + date);
		marker.setMap(map);*/
	}
	
});
