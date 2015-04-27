$(function () {
	new App.Router();

	window.appVersion = 2;

	window.competitions = new App.Collection.Competition();
	window.competitions.fetch({sort: false});
	if (
		window.competitions.length < 7 ||
		(window.competitions.length > 0 && window.competitions.first().get('version') !== window.appVersion)
	) {
		var competition;
		while (competition = window.competitions.first()) {
			competition.dispose();
		};
		window.competitions.add(new App.Model.Competition({name: 'EUR Open', tabName: 'europe-open', version: window.appVersion,
			slalomMenStartSpeed: 58, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 55, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U21', tabName: 'europe-u21', version: window.appVersion,
			slalomMenStartSpeed: 55, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 52, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U17', tabName: 'europe-u17', version: window.appVersion,
			slalomMenStartSpeed: 52, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 49, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'EUR U14', tabName: 'europe-u14', version: window.appVersion,
			slalomMenStartSpeed: 49, slalomMenTopSpeed: 55, slalomWomenStartSpeed: 46, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL Open', tabName: 'cableski-open', version: window.appVersion,
			slalomMenStartSpeed: 46, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 43, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL U19', tabName: 'cableski-u19', version: window.appVersion,
			slalomMenStartSpeed: 43, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 40, slalomWomenTopSpeed: 55}), {sort: false});
		window.competitions.add(new App.Model.Competition({name: 'CBL U15', tabName: 'cableski-u15', version: window.appVersion,
			slalomMenStartSpeed: 40, slalomMenTopSpeed: 58, slalomWomenStartSpeed: 37, slalomWomenTopSpeed: 55}), {sort: false});
	};

	var competitionsView = new App.View.CompetitionCollection({collection: competitions});
	competitionsView.render();
	
	// TODO uncomment when everything is ready. For testing this is too annoying :D
	/*
	window.onbeforeunload = function() {
        return "Вы уверены, что хотите покинуть страницу? Все текущие данные будут потеряны!";
    }
	*/
});