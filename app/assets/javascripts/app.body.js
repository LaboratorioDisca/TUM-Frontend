/*
 *  Todo: Make unique identifier for each route it's number and not it's ID on the backend db
 *
 */

var TUMCore = function(params) {
	var tilesURL=params.tilesURL;
	var url=params.url;
	var map=params.map;

	// Data Structures
	var linesCount = 0;
	// Stores:
	// { lineId : <Line>, ...}
	var lines = null;
	// Stores:
	// [lineId, ...]
	var selectedLines = [];
	// Stores:
	// { lineId : [vehicleId, ...], ... }
	var vehicleLines = {};
	// Stores:
	// { vehicleId : { vehicle: <Vehicle>, instant: <Instant>, marker: <Leaftlet Marker> }, line: lineId ... }
	var vehicles = null;
	var currentlySelectedVehicle = null;
	
	var localeizator = new LocalesDictionary("es");

	// Associated views
	var rightPanel = "#right-panel";
	var rightPanelExtended = '#right-panel-extended';
	var defaultSize = "500px";
	var smallSize = "350px";
	
	var initialize = function() {
		fetchLines();
		loadPresets();
		locatizationDefinitions();
	}	
	
	var loadPresets = function() {
		$('.details').live('click', function() {
			updateSelectionOfRouteWithId(parseInt($(this).parent().attr('id')), $(this).parent().attr('route'), $(this));
		});
	}
	
	// Add or remove a route from the selection list
	var updateSelectionOfRouteWithId = function(id, routeNumber, domElement) {
		var itemIdx = _.indexOf(selectedLines, id);
		if(itemIdx >= 0) {
			selectedLines = _.difference(selectedLines, [id]);
			domElement.removeClass('selected');
			// Remove multipolyline associated to route
			map.removeLayer(lines[routeNumber].paths);
			
			// Fetch vehicles associated to the given route
			var vehicleForLines = vehicleLines[id];
			for(var vehicleIdx in vehicleForLines) {
				var vehicleId = vehicleForLines[vehicleIdx];
				// and remove them from the map
				map.removeLayer(vehicles[vehicleId].marker);
			}
			
		} else {
			selectedLines.push(id);
			domElement.addClass('selected');
			// Add multipolyline associated to route
			map.addLayer(lines[routeNumber].paths);
		}
	}
	
	var fetchLines = function(callback) {
		if(lines == null) {
			// attempts a new fetch of the list of routes
			$.getJSON(webServiceURL+"transports/8/lines?callback=?", function(data){
				lines = {};
				linesCount = data.length;
				
				for(var idx in data) {
					var line = data[idx];
					// Chunk route name to route number only (TODO: Change this field on the backend)
					var lineNumber = line["name"].replace("Ruta ", "");
					
					// Build the polylines
					var polyLineGroupGroup = [];
					for(var polyLineIdx in line["paths"]) {
						var polyLine = line["paths"][polyLineIdx];
						var polyLineGroup = [];
						for(var pairObjIdx in polyLine) {
							var lat = polyLine[pairObjIdx].lat;
							var lon = polyLine[pairObjIdx].lon;
							var coord = new L.LatLng(lat, lon);
							polyLineGroup.push(coord);
						}
						polyLineGroupGroup.push(polyLineGroup);
					}
					
					// Buld the multipolyline and bind to it a popup window
					var polyLineMap = new L.MultiPolyline(polyLineGroupGroup, {color: line["color"], opacity: 1 });
					polyLineMap.bindPopup("<b>Ruta "+lineNumber+"</b>", {maxWidth: 200, maxHeight: 100});
					line["paths"] = polyLineMap;
					lines[parseInt(lineNumber)] = line; 
				}
				// If a callback function is provided, it gets executed
				if(callback) {
					callback();
				}
			});
		} else {
			// Execute the callback function (if any) if routes have been already loaded
			if(callback) {
				callback();
			}
		}
	}

	var fetchVehicles = function() {
		if(vehicles == null) {
			$.getJSON(webServiceURL+"vehicles?callback=?", function(data) {
				vehicles = {};
				
				for(var idx in data) {
					var line = null;
					var vehicle = data[idx];
					
					// Find the route this vehicle is associated to
					for(var idxLine in lines) {
						if(lines[idxLine]["id"] == vehicle.lineId) {
							line = lines[idxLine];
						}
					}
					
					// Load icon
					var myIcon = L.icon({
					    iconUrl: webServiceURL+'assets/images/'+line.simpleIdentifier+'.png',
					    iconSize: [32, 37]
					});
					// Build marker
					var marker = new L.marker([0,0], {icon: myIcon, title: "Vehiculo # "+vehicle.publicNumber + " (Click para más info)", vehicleId : vehicle["id"] });
					marker.on('click', function(e) {
						window.location.hash = "#/vehicles/" + e["target"]["options"]["vehicleId"];
					});
					
					// Merge the list of vehicles for this route
					var existingVehicleLines = vehicleLines[vehicle.lineId];
					if(existingVehicleLines == null) {
						existingVehicleLines = [];
					}
					
					// Store a list of vehicles associated to a route
					vehicleLines[line["id"]] = _.union(existingVehicleLines, [vehicle["id"]]);
					// Store a vehicle object with related object
					vehicles[vehicle["id"]] = {vehicle : vehicle, marker : marker, line : line};
				}
			});
			
			setInterval(fetchRecentInstants, 3000);
		}
	}
	
	var fetchRecentInstants = function() {
		$.getJSON(webServiceURL+"instants/minutesago/3?callback=?", function(data){
			for(var idx in data) {
				// TODO: Drop vehicleId from new instant object
				vehicles[data[idx].vehicleId]["instant"] = data[idx];
			}
			drawVehiclesForCurrentlySelectedRoutes();
		}).error(function() {
			appendErrorFor("unknown-error");
		});
	}
	
	// UI Construction
	
	var toggleRightPanel = function(dom) {		
		if(isRightPanelHidden(dom)) {
			// Show it
			$(dom).animate(
				{ right: 0 }, {
					duration: 800,
					easing: 'easeOutBack'
			});
		} else {
			// Hide it
			$(dom).animate(
				{ right: -$(dom).outerWidth() }, {
					duration: 800,
					easing: 'easeOutBack'
			});
		}
	}
	
	var isRightPanelHidden = function(dom) {
		return $(dom).offset().left == $(window).width();
	}
	
	var drawVehiclesForCurrentlySelectedRoutes = function() {
		for(var idx in selectedLines) {
			var lineId = selectedLines[idx];
			
			var vehicleForLines = vehicleLines[lineId];
			for(var vehicleIdx in vehicleForLines) {
				var vehicleId = vehicleForLines[vehicleIdx];
				
				var vehicleInstant = vehicles[vehicleId].instant;
				if(vehicleInstant != null) {
					updateVehicleAssociatedViews(vehicleId);
				}
			}
		}
	}
	
	var deselectAllMenuEntries = function() {
		$(rightPanel + " .menu li").removeClass('selected');
		// Reset HTML Contents
		$(rightPanel + " .routes").html("");
		$(rightPanel + " .routes").hide();
		$(rightPanel + " .timetables").hide();
		$(rightPanel + " .about").hide();
	}
	
	var locatizationDefinitions = function() {
		$.prettyDate.messages = { 
			now: "hace unos instantes", 
			minute: "hace menos de un minuto", 
			minutes: $.prettyDate.template("hace {0} minutos"), 
			hour: "hace aproximadamente una hora", 
			hours: $.prettyDate.template("hace {0} horas"), 
			yesterday: "ayer", 
			days: $.prettyDate.template("hace {0} días"), 
			weeks: $.prettyDate.template("hace {0} semanas")
		};
	}
	
	// URL Routes responders
	
	var updateVehicleAssociatedViews = function(vehicleId) {
		// Compute marker time to see if it can still be displayed
		var timestampMili = vehicles[vehicleId].instant["createdAt"]
		var currentMili = new Date().getMilliseconds();	
		var seconds = Math.floor(Math.abs(currentMili-timestampMili) / 1000);
		var minutesElapsed = Math.floor(seconds / 60);
					
		var marker = vehicles[vehicleId].marker;
					
		// If currently selected vehicle is the same as vehicleId, then build/update the view
		if(currentlySelectedVehicle == vehicleId) {
			// Fetch handlebars template
			var source   = $("#vehicle-template").html();
			var template = Handlebars.compile(source);
		
			var date = new Date(timestampMili);
		
			var variables = _.extend({ 
				lineOrigin: vehicles[currentlySelectedVehicle].line.leftTerminal,
				lineDestination: vehicles[currentlySelectedVehicle].line.rightTerminal,
				busNumber: vehicles[currentlySelectedVehicle].vehicle.publicNumber, 
				busSpeed: vehicles[currentlySelectedVehicle].instant["speed"], 
				busReportTimestamp: localeizator.stringsWithCurrentLang["vehicles"]["today"] + date.getHours() + ":" + date.getMinutes() }, 
				localeizator.stringsWithCurrentLang["vehicles"]["groupedDetails"]);
		
			$(rightPanelExtended + " .vehicle-details").html(template(variables));
			$(rightPanelExtended + " .vehicle-details").css("border-color", vehicles[currentlySelectedVehicle].line["color"]);
			$(rightPanelExtended + " .vehicle-details .identificators").css("background-color", vehicles[currentlySelectedVehicle].line["color"]);
		}

		console.log("Minutes elapsed: " + minutesElapsed);
		if(minutesElapsed > 3) {
			map.removeLayer(marker);
		} else {
			// Add the marker if not already added
			if(!map.hasLayer(marker)) {
				marker.addTo(map);
			}
			// Set is position according to the last instant
			marker.setLatLng(new L.LatLng(vehicleInstant.coordinate.lat, vehicleInstant.coordinate.lon));
		}
	}
	
	var localizationForVehicleDetails = function(lang) {
			return {
				speedPrelude: "Velocidad promedio: ",
				speedMetrics: " km/h",
				reportTimestampPrelude: "Reporte recibido: "
			}
	}
	
	this.clearVehicleSelection = function() {
		currentlySelectedVehicle = null;
		window.location.hash = "#/routes";
	}
	
	this.expandedVehicleInfo = function() {
		currentlySelectedVehicle = this.params["vehicleId"];
		
		// Should hide default right panel
		if(!isRightPanelHidden(rightPanel)) {
			toggleRightPanel(rightPanel);
		}
		// Should show extended right panel
		if(isRightPanelHidden(rightPanelExtended)) {
			toggleRightPanel(rightPanelExtended);
		}
		
		fetchLines(function() {
			// Fetch handlebars template
			var source   = $("#route-details-template").html();
			var template = Handlebars.compile(source);
			
			// For each route
			for(var i = 1 ; i <= linesCount ; i++) {
				var line = lines[i];
				
				var color = line["color"];
				var id = line["id"];
				var number = line["name"].replace("Ruta ", "");
				// Replace with variables
				var html    = template({ id: id, lineNumber : number, leftTerminal : line.leftTerminal, rightTerminal : line.rightTerminal });
				// And append generated html
				$(rightPanel + " .routes").append(html);
				$(rightPanel + " .routes " + "#" + id + " .color").css('background-color', color);
				
				var itemIdx = _.indexOf(selectedLines, parseInt(id));
				if(itemIdx >= 0) {
					$(rightPanel + " .routes " + "#" + id + " .details").addClass('selected');
				}
			}
			// Now, fetch all the vehicles
			fetchVehicles();
			setInterval(updateVehicleAssociatedViews, 8000);
		});


	}
	
	this.routes = function() {
		// Should show default right panel
		if(isRightPanelHidden(rightPanel)) {
			toggleRightPanel(rightPanel);
		}
		// Should hide extended right panel
		if(!isRightPanelHidden(rightPanelExtended)) {
			toggleRightPanel(rightPanelExtended);
		}
		
		deselectAllMenuEntries();
		$(rightPanel + " .menu li.routes-entry").addClass('selected');
		
		fetchLines(function() {
			// Fetch handlebars template
			var source   = $("#route-details-template").html();
			var template = Handlebars.compile(source);
			
			// For each route
			for(var i = 1 ; i <= linesCount ; i++) {
				var line = lines[i];
				
				var color = line["color"];
				var id = line["id"];
				var number = line["name"].replace("Ruta ", "");
				// Replace with variables
				var html    = template({ id: id, lineNumber : number, leftTerminal : line.leftTerminal, rightTerminal : line.rightTerminal });
				// And append generated html
				$(rightPanel + " .routes").append(html);
				$(rightPanel + " .routes " + "#" + id + " .color").css('background-color', color);
				
				var itemIdx = _.indexOf(selectedLines, parseInt(id));
				if(itemIdx >= 0) {
					$(rightPanel + " .routes " + "#" + id + " .details").addClass('selected');
				}
			}
			// Now, fetch all the vehicles
			fetchVehicles();
		});
		
		$(rightPanel).css('height', defaultSize);
		$(rightPanel + " .routes").fadeIn();
	}
	
	this.timetables = function() {
		deselectAllMenuEntries();
		// Should show default right panel
		if(isRightPanelHidden(rightPanel)) {
			toggleRightPanel(rightPanel);
		}
		
		$(rightPanel + " .menu li.timetables-entry").addClass('selected');
		
		// Fetch handlebars template
		var source   = $("#timetables-template").html();
		var template = Handlebars.compile(source);
		var html    = template(localeizator.stringsWithCurrentLang["timetables"]);
		
		$(rightPanel + " .timetables").html(html);
		$(rightPanel).css('height', smallSize);
		$(rightPanel + " .timetables").fadeIn();
		
	}
	
	this.about = function() {
		deselectAllMenuEntries();
		// Should show default right panel
		if(isRightPanelHidden(rightPanel)) {
			toggleRightPanel(rightPanel);
		}
		
		$(rightPanel + " .menu li.about-entry").addClass('selected');
		
		// Fetch handlebars template
		var source   = $("#about-template").html();
		var template = Handlebars.compile(source);
		var html    = template(localeizaor.stringsWithCurrentLang["about"]);
		
		$(rightPanel + " .about").html(html);
		$(rightPanel).css('height', defaultSize);
		$(rightPanel + " .about").fadeIn();
		
		$("#pictures").slides({
			play: 5000,
			pause: 2500,
			hoverPause: true
		});
	}
	
	initialize();
}

