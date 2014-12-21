$(function () {
	App.Collection.Team = Backbone.Collection.extend({
		model: App.Model.Team,

		dispose: function() {
			var team;
			while (team = this.first()) {
				team.dispose();
			}
			this.off();
		}
	});
});