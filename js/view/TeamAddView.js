$(function() {
	App.View.AddTeam = Backbone.View.extend({
		el: '.js-team-add',

		initialize: function() {
		},

		events: {
			'submit': 'submit'
		},

		submit: function (e) {
			e.preventDefault();

			var newTeamName = $(e.currentTarget).find('input[type=text]').val();
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