$(function () {
	new App.Router();
	Backbone.history.start(); // todo del

	window.competitions = new App.Collection.Competition();
	window.competitions.fetch();
	if (window.competitions.length == 0) {
		window.competitions.add(new App.Model.Competition({name: 'Общее'}));
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