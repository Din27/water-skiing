$(function () {
	App.Collection.Team = Backbone.Collection.extend({
		model: App.Model.Team,
		localStorage: new Backbone.LocalStorage("teams") 
	});
});