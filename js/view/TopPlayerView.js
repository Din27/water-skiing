$(function() {
	App.View.TopPlayer = Backbone.View.extend({
		template: template('topPlayerTemplate'),

		tagName: 'tr',

		initialize: function(options) {
			_.extend(this, _.pick(options, "slalomMenTracks", "slalomWomenTracks"));
		},

		render: function() {
			var template = this.template(_.extend(this.model.toJSON(), {slalomMenTracks: this.slalomMenTracks, slalomWomenTracks: this.slalomWomenTracks}));
			this.$el.html(template);
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