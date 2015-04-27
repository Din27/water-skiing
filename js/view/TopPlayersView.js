$(function() {
	App.View.TopPlayers = Backbone.View.extend({
		template: template('topPlayersTemplate'),

		tagName: 'div',

		className: 'top-players',

		initialize: function (options) {
			_.extend(this, _.pick(options, "slalomMenTracks", "slalomWomenTracks"));
			this.topPlayerViews = [];
		},

		render: function () {
			this.$el.html(this.template());
			_.each(this.topPlayerViews, function (topPlayerView) {
				topPlayerView.remove();
			});
			this.topPlayerViews = [];

			var allPlayers = [];
			this.collection.each(function (team) {
				team.getPlayers().each(function (player) {
					allPlayers.push(player);
				});
			});
			var sortedPlayers = _.sortBy(allPlayers, function(player) { return - player.getOverallScore(); });
			_.each(sortedPlayers, _.bind(function(player) {
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