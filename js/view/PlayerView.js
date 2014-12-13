$(function () {
	App.View.Player = Backbone.View.extend({
		initialize: function () {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		tagName: 'tr',

		template: template('playerTemplate'),

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
			'change .playerName': 'editName',
			'change .playerGender': 'editGender'
		},

		editName: function () {
			var newName = $(this.el).find('.playerName').val();
			this.model.setName(newName);
			this.render();
		},

		editGender: function () {
			var playerGender = $(this.el).find('.playerGender').val();
			this.model.setGender(playerGender);
			this.render();
		},

		destroy: function () {
			this.model.destroy();
		}
	});
});