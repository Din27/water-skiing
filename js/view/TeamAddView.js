$(function() {
	App.View.AddTeam = Backbone.View.extend({
		el: '#addTeam',

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

			console.log('������� "' + newTeamName + '" ���������');
			console.log(newTeam);
		}
	})
});