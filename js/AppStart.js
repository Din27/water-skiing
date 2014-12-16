$(function () {
	new App.Router();
	Backbone.history.start();

	window.teams = new App.Collection.Team();
	window.teams.fetch();
	window.updateScores();

	var teamsView = new App.View.TeamCollection({collection: teams});
	$('.teams').html(teamsView.render().el);

	var addTeamView = new App.View.AddTeam({collection: teams});
	
	// TODO uncomment when everything is ready. For testing this is too annoying :D
	/*
	window.onbeforeunload = function() {
        return "Вы уверены, что хотите покинуть страницу? Все текущие данные будут потеряны!";
    }
	*/
});