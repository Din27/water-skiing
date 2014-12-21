$(function () {
	new App.Router();
	Backbone.history.start(); // todo del

	window.competitions = new App.Collection.Competition();
	window.competitions.fetch();
	if (
		window.competitions.length < 4 ||
		(window.competitions.length > 0 && window.competitions.first().getTeams().length > 0 && _.isUndefined(window.competitions.first().getTeams().first().getPlayers().first().getColorIndex()))
	) {
		var competition;
		while (competition = window.competitions.first()) {
			competition.dispose();
		};
		window.competitions.add(new App.Model.Competition({name: 'Все', tabName: 'mixed'}));
		window.competitions.add(new App.Model.Competition({name: 'До 14', tabName: 'u14'}));
		window.competitions.add(new App.Model.Competition({name: 'До 17', tabName: 'u17'}));
		window.competitions.add(new App.Model.Competition({name: 'До 21', tabName: 'u21'}));
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