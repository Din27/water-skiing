$(function() {
	App.View.TopPlayers = Backbone.View.extend({
		template: template('topPlayersTemplate'),

		tagName: 'div',

		className: 'top-players',

		initialize: function (options) {
			_.extend(this, _.pick(options, 'genderName', 'slalomMenTracks', 'slalomWomenTracks'));
			this.topPlayerViews = [];
		},

		render: function () {
			this.$el.html(this.template({genderName: this.genderName}));
			_.each(this.topPlayerViews, function (topPlayerView) {
				topPlayerView.remove();
			});

			this.topPlayerViews = [];
			// collection of top players already sorted
			_.each(this.collection, _.bind(function(player) {
				var topPlayerView = new App.View.TopPlayer({model: player, slalomMenTracks: this.slalomMenTracks, slalomWomenTracks: this.slalomWomenTracks});
				this.topPlayerViews.push(topPlayerView);
				this.$el.find('tbody').append(topPlayerView.render().el);
			}, this));
			return this;
		},

		remove: function() {
			_.each(this.topPlayerViews, function (topPlayerView) {
				topPlayerView.remove();
			});
			this.undelegateEvents();
			this.$el.empty();
			this.unbind();
		}
	})
});