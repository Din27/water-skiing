$(function() {
	App.View.AddTeam = Backbone.View.extend({
		el: '.js-team-add',

		initialize: function() {
		},

		events: {
			'click .js-team-add-button': 'addTeam'
		},

		addTeam: function (e) {
			e.preventDefault();
			var newTeamName = this.$el.find('.js-team-name').val();
			var newTeam = new App.Model.Team({name: newTeamName}, {validate: true});
			this.collection.add(newTeam, {validate: true});
			newTeam.save(null, {success: function() {
				console.log('Команда "' + newTeamName + '" сохранена');
			}, error: function() {
				console.log('Команда "' + newTeamName + '" не сохранена');
			}});
		}
	})
});