$(function () {
	new App.Router();

	window.appVersion = 2;

	window.competitions = new App.Collection.Competition();
	window.competitions.fetch();
	if (
		window.competitions.length < 4 ||
		(window.competitions.length > 0 && window.competitions.first().get('version') !== window.appVersion)
	) {
		var competition;
		while (competition = window.competitions.first()) {
			competition.dispose();
		};
		window.competitions.add(new App.Model.Competition({name: 'Все', tabName: 'mixed', version: window.appVersion}));
		window.competitions.add(new App.Model.Competition({name: 'До 14', tabName: 'u14', version: window.appVersion}));
		window.competitions.add(new App.Model.Competition({name: 'До 17', tabName: 'u17', version: window.appVersion}));
		window.competitions.add(new App.Model.Competition({name: 'До 21', tabName: 'u21', version: window.appVersion}));
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