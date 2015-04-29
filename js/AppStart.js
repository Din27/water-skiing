$(function () {
	new App.Router();

	window.APP_VERSION = 27;
	window.APP_LOCAL_STORAGE_VERSION_KEY = 'water-skiing-version';

	var localStorageAppVersion = +localStorage.getItem(APP_LOCAL_STORAGE_VERSION_KEY);

	window.competitions = new App.Collection.Competition();
	window.competitions.comparator = 'id';

	// we need it in any case, otherwise competitions collection does not get saved from the first try
	// this looks like backbone.localStorage bug (or feature, haha)
	window.competitions.fetch({sort: true});

	if (localStorageAppVersion != window.APP_VERSION || window.competitions.length < 7) {
		var competition;
		while (competition = window.competitions.first()) {
			competition.dispose();
		}

		// "Local storage is per domain. All pages, from one domain, can store and access the same data."
		// removeKey does not work since backbone localStorage saves many items there in a random way.
		// TODO is it ok to clear whole localStorage?
		localStorage.clear();

		//europe
		window.competitions.add(
			new App.Model.Competition({id: 1, name: 'EUR Open', tabName: 'europe-open',
				slalomMenStartSpeed: 58, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 55, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 25, jumpWomenDeduction: 17,
				competitionType: window.COMPETITION_TYPES.EUROPE,
				worldRecordSlalomMen: 49, worldRecordSlalomWomen: 43,
				worldRecordTricksMen: 11680, worldRecordTricksWomen: 8580,
				worldRecordJumpMen: 67.8, worldRecordJumpWomen: 50.5}
			), {sort: true}
		);
		window.competitions.add(
			new App.Model.Competition({id: 2, name: 'EUR U21', tabName: 'europe-u21',
				slalomMenStartSpeed: 55, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 52, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 25, jumpWomenDeduction: 17,
				competitionType: window.COMPETITION_TYPES.EUROPE,
				worldRecordSlalomMen: 55, worldRecordSlalomWomen: 49,
				worldRecordTricksMen: 11680, worldRecordTricksWomen: 8580,
				worldRecordJumpMen: 67.8, worldRecordJumpWomen: 50.5}
			), {sort: true}
		);
		window.competitions.add(
			new App.Model.Competition({id: 3, name: 'EUR U17', tabName: 'europe-u17',
				slalomMenStartSpeed: 52, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 49, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 10, jumpWomenDeduction: 7,
				competitionType: window.COMPETITION_TYPES.EUROPE,
				worldRecordSlalomMen: 51, worldRecordSlalomWomen: 44,
				worldRecordTricksMen: 10510, worldRecordTricksWomen: 8750,
				worldRecordJumpMen: 53.3, worldRecordJumpWomen: 44.8}
			), {sort: true}
		);
		window.competitions.add(
			new App.Model.Competition({id: 4, name: 'EUR U14', tabName: 'europe-u14',
				slalomMenStartSpeed: 49, slalomMenTopSpeed: 55, slalomWomenStartSpeed: 46, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 10, jumpWomenDeduction: 7,
				competitionType: window.COMPETITION_TYPES.EUROPE,
				worldRecordSlalomMen: 47, worldRecordSlalomWomen: 44.5,
				worldRecordTricksMen: 7990, worldRecordTricksWomen: 6580,
				worldRecordJumpMen: 43.6, worldRecordJumpWomen: 33.3}
			), {sort: true}
		);

		//cableski
		window.competitions.add(
			new App.Model.Competition({id: 5, name: 'CBL Open', tabName: 'cableski-open',
				slalomMenStartSpeed: 46, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 43, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 15, jumpWomenDeduction: 10,
				competitionType: window.COMPETITION_TYPES.CABELSKI,
				worldRecordSlalomMen: 0, worldRecordSlalomWomen: 0,
				worldRecordTricksMen: 0, worldRecordTricksWomen: 0,
				worldRecordJumpMen: 0, worldRecordJumpWomen: 0}
			), {sort: true}
		);
		window.competitions.add(
			new App.Model.Competition({id: 6, name: 'CBL U19', tabName: 'cableski-u19',
				slalomMenStartSpeed: 43, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 40, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 10, jumpWomenDeduction: 5,
				competitionType: window.COMPETITION_TYPES.CABELSKI,
				worldRecordSlalomMen: 0, worldRecordSlalomWomen: 0,
				worldRecordTricksMen: 0, worldRecordTricksWomen: 0,
				worldRecordJumpMen: 0, worldRecordJumpWomen: 0}
			), {sort: true}
		);
		window.competitions.add(
			new App.Model.Competition({id: 7, name: 'CBL U15', tabName: 'cableski-u15',
				slalomMenStartSpeed: 40, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 37, slalomWomenTopSpeed: 55,
				jumpMenDeduction: 0, jumpWomenDeduction: 0,
				competitionType: window.COMPETITION_TYPES.CABELSKI,
				worldRecordSlalomMen: 0, worldRecordSlalomWomen: 0,
				worldRecordTricksMen: 0, worldRecordTricksWomen: 0,
				worldRecordJumpMen: 0, worldRecordJumpWomen: 0}
			), {sort: true}
		);

		localStorage.setItem(APP_LOCAL_STORAGE_VERSION_KEY, window.APP_VERSION);
	}


	var competitionsView = new App.View.CompetitionCollection({collection: competitions});
	competitionsView.render();
	
	// TODO uncomment when everything is ready. For testing this is too annoying :D
	/*
	window.onbeforeunload = function() {
        return "Вы уверены, что хотите покинуть страницу? Все текущие данные будут потеряны!";
    }
	*/
});