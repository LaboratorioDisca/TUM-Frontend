var TUMCore = function(params) {
	var tilesURL=params.tilesURL;
	var url=params.url;
	
	// Associated views
	var routesMainPanel = "#routes-main-panel";
	var routesListingPanel = "#routes-listing-panel";
	

	var initialize = function() {

	}	
	
	this.landing = function() {
		console.log('loaded landing');
		$(routesMainPanel).slideDown(400);
	}
	
	this.routes = function() {
		console.log('viewing routes');
		$(routesMainPanel).slideUp(200);
		$(routesListingPanel).delay(400).slideDown(600);
	}
	
	initialize();
}

