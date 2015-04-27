$(function () {
	new App.Router();

	window.appVersion = 10;
	window.appLocalStorageVersionKey = 'water-skiing-version';

	var localStorageAppVersion = +localStorage.getItem(appLocalStorageVersionKey);

	window.competitions = new App.Collection.Competition();
	if (localStorageAppVersion == window.appVersion) {
		window.competitions.fetch({sort: false});
	}
	if (localStorageAppVersion != window.appVersion || window.competitions.length < 7) {
		var competition;
		while (competition = window.competitions.first()) {
			competition.dispose();
		}

		localStorage.clear(); // TODO is it ok to clear whole localStorage?
		// "Local storage is per domain. All pages, from one domain, can store and access the same data."
		// removeKey does not work since backbone localStorage saves many items there in a random way.

		window.competitions.add(new App.Model.Competition({name: 'EUR Open', tabName: 'europe-open',
			slalomMenStartSpeed: 58, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 55, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U21', tabName: 'europe-u21',
			slalomMenStartSpeed: 55, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 52, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U17', tabName: 'europe-u17',
			slalomMenStartSpeed: 52, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 49, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U14', tabName: 'europe-u14',
			slalomMenStartSpeed: 49, slalomMenTopSpeed: 55, slalomWomenStartSpeed: 46, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL Open', tabName: 'cableski-open',
			slalomMenStartSpeed: 46, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 43, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL U19', tabName: 'cableski-u19',
			slalomMenStartSpeed: 43, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 40, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL U15', tabName: 'cableski-u15',
			slalomMenStartSpeed: 40, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 37, slalomWomenTopSpeed: 55}), {sort: false})

		localStorage.setItem(appLocalStorageVersionKey, window.appVersion);
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