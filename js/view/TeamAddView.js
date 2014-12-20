$(function() {
	App.View.AddTeam = Backbone.View.extend({
		template: template('teamAddTemplate'),

		//el: '.js-team-add',

		initialize: function() {
		},

		events: {
			'click .js-team-add-button': 'addTeam'
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		},

		addTeam: function (e) {
			e.preventDefault();
			var name = this.$el.find('.js-team-name').val();
			var colorIndex = +this.$el.find('.js-team-color').val();
			if (!$.trim(name)) name = "Команда";
			var newTeam = new App.Model.Team({name: name, colorIndex: colorIndex}, {validate: true});
			this.collection.add(newTeam, {validate: true});
		}
	})
});