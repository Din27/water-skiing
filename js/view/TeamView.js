$(function () {
	App.View.Team = Backbone.View.extend({
		initialize: function () {
			this.model.on('change', this.render, this)
			this.model.on('destroy', this.remove, this)
		},

		tagName: 'li',
		
		template: template('teamTemplate'),

		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		},

		remove: function () {
			this.$el.remove();
			return this;
		},

		events: {
			'change .teamName': 'editTeam',
			'click .deleteTeam': 'destroy'
		},

		editTeam: function () {
			var newName = $(this.el).find('.teamName').val();
			this.model.setName(newName);
			this.render();
		},

		destroy: function () {
			this.model.destroy();
		}
	});
});