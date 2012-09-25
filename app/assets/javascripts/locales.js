currentLang = "espanol";

var LocalesDictionary = function(lang) {
	
	var localizedStrings = {
		espanol: {
			linkLang: "Cambiar a Inglés",
			mainMenu: { 
				linkRoutes: "Rutas", 
				linkAbout : "Acerca de", 
				linkTimetables: "Horarios"
			},
			vehicles: {
				groupedDetails: {
					speedPrelude: "Velocidad promedio: ",
					speedMetrics: " km/h",
					reportTimestampPrelude: "Reporte recibido: "
				},
				today: "Hoy a las "
			},
			timetables: {
				weekdays: "Lunes a Viernes",
				saturdays: "Sábados",
				sundays: "Domingos",
				weekdaysDetails: "Todas las rutas de 6:00 a 22:00 hrs",
				saturdaysDetailsOne: "Rutas 1, 2, 4, 5 y 9 de 6:00 a 15:00 hrs",
				saturdaysDetailsTwo: "Rutas 3 y 10 de 6:00 a 23:00 hrs",
				sundaysDetails: "Rutas 3 y 10 de 6:00 a 23:00 hrs"
			},
			about: {
				projectCredits: "Proyecto desarrollado con el apoyo de",
				projectConsiderationsMain: "Esta aplicación y la infraestructura de telecomunicaciones incorporada a cada Pumabús están en proceso de mejora:",
				projectConsiderationsDisclaimer: "En ciertas horas del día, por la saturación de la red GSM cercana al campus, la ubicación reportada por algunos pumabuses podría no estar disponible o estarlo con un tiempo de retraso considerable.",
				app_version: "Versión 1.0"
			}
		},
		english: {
			linkLang: "Change to Spanish",
			mainMenu: { 
				linkRoutes: "Routes", 
				linkAbout : "About", 
				linkTimetables: "Schedules"
			},
			vehicles: {
				groupedDetails: {
					speedPrelude: "Average Speed: ",
					speedMetrics: " km/h",
					reportTimestampPrelude: "Report received on: "
				},
				today: "Today at "
			},
			timetables: {
				weekdays: "Monday to Friday",
				saturdays: "Saturdays",
				sundays: "Sundays",
				weekdaysDetails: "All the routes from 6:00 to 22:00 hrs",
				saturdaysDetailsOne: "Routes 1, 2, 4, 5 and 9: 6:00 to 15:00 hrs",
				saturdaysDetailsTwo: "Routes 3 and 10: 6:00 to 23:00 hrs",
				sundaysDetails: "Routes 3 and 10: 6:00 to 23:00 hrs"
			},
			about: {
				projectCredits: "Proyect developed with the support of",
				projectConsiderationsMain: "This app and the telecommunication infrastructure embedded on every Pumabús are under improvement:",
				projectConsiderationsDisclaimer: "At certain times along the day due campus nearby GSM network saturation, the reported location by some pumabuses could be not available or could it be with a considerable delay.",
				app_version: "Version 1.0"
			}
		}
	}
	
	this.stringsWithCurrentLang = function() {
		return localizedStrings[currentLang];
	}
}
