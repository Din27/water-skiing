$(function () {
	App.View.TeamCollection = Backbone.View.extend({
		tagName: 'ul',

		initialize: function (options) {
			_.extend(this, _.pick(options, "slalomMenTracks", "slalomWomenTracks"));
			this.teamViews = [];
			this.collection.on('add', this.render, this);
		},

		render: function () {
			_.each(this.teamViews, function(teamView) {
				teamView.remove();
			});
			this.teamViews = [];
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (team) {
			var teamView = new App.View.Team({model: team, slalomMenTracks: this.slalomMenTracks, slalomWomenTracks: this.slalomWomenTracks});
			this.teamViews.push(teamView);
			this.$el.append(teamView.render().el);
		},

		dispose: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.unbind();
		}
	});
});
