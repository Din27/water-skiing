$(function() {
	App.View.TopPlayer = Backbone.View.extend({
		template: template('topPlayerTemplate'),

		tagName: 'tr',

		initialize: function() {
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.css('background-color', window.TEAM_COLORS[this.model.getColorIndex()].color);
			return this;
		},

		remove: function () {
			this.undelegateEvents();
			this.stopListening();
			this.$el.empty();
			this.unbind();
			return this;
		}
	})
});