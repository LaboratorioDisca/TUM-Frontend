var LocalesDictionary = function(lang) {
	var currentLang = "es";
	
	var localizedStrings = {
		es : {
			vehicles : {
				groupedDetails {
					speedPrelude: "Velocidad promedio: ",
					speedMetrics: " km/h",
					reportTimestampPrelude: "Reporte recibido: "
				},
				today: "Hoy a las "
			},
			timetables : {
				weekdays: "Lunes a Viernes",
				saturdays: "Sábados",
				sundays: "Domingos",
				weekdaysDetails: "Todas las rutas de 6:00 a 22:00 hrs",
				saturdaysDetailsOne: "Rutas 1, 2, 4, 5 y 9 de 6:00 a 15:00 hrs",
				saturdaysDetailsTwo: "Rutas 3 y 10 de 6:00 a 23:00 hrs",
				sundaysDetails: "Rutas 3 y 10 de 6:00 a 23:00 hrs"
			},
			about : {
				projectCredits: "Proyecto desarrollado con el apoyo de",
				projectConsiderationsMain: "Esta aplicación y la infraestructura de telecomunicaciones incorporada a cada Pumabús están en proceso de mejora:",
				projectConsiderationsDisclaimer: "En ciertas horas del día, por la saturación de la red GSM cercana al campus, la ubicación reportada por algunos pumabuses podría no estar disponible o estarlo con un tiempo de retraso considerable.",
				app_version: "Versión 1.0"
			}
		}
	}

	var stringsWithCurrentLang = function() {
		return localizedStrings[currentLang];
	}
}
