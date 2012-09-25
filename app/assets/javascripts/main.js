var webServiceURL = "http://132.248.51.251:9000/";
var tilesURL = "http://132.248.51.251:8888/v2/UNAMCU.json";
var map;

$(document).ready(function() {
	var defaultLatLng = new L.LatLng(19.322675,-99.192080);
	map = new L.Map('map').setView(defaultLatLng, 16);

	var coreInstance = new TUMCore({ tilesURL : tilesURL, url : webServiceURL, map: map, latLng: defaultLatLng });
	
	Path.map("#/").to(coreInstance.routes);
	Path.map("#/routes(/:lang)").to(coreInstance.routes);
	Path.map("#/timetables(/:lang)").to(coreInstance.timetables);
	Path.map("#/about(/:lang)").to(coreInstance.about);
	Path.map("#/vehicles/:vehicleId").to(coreInstance.expandedVehicleInfo);
	Path.map("#/clearVehicleSelection").to(coreInstance.clearVehicleSelection);
	Path.root("#/");
	Path.listen();
	
  // Get metadata about the map from MapBox
  wax.tilejson(tilesURL, function(tilejson) {
      // Add MapBox Streets as a base layer

      map.addLayer(new wax.leaf.connector(tilejson));
  });
	
});
