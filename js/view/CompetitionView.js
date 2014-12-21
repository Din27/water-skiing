$(function () {
	App.View.Competition = Backbone.View.extend({
		//todo remove events here, dispose
		initialize: function () {
			this.addTeamView = new App.View.AddTeam({collection: this.model.getTeams()});
			this.teamCollectionView = new App.View.TeamCollection({collection: this.model.getTeams()});
			this.topPlayersView = new App.View.TopPlayers({collection: this.model.getTeams()});
			this.model.on('teamsReset', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		template: template('competitionTemplate'),

		_selectors: {},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find('.js-teams-list').html(this.teamCollectionView.render().el);

			this.addTeamView.remove();
			this.addTeamView = new App.View.AddTeam({collection: this.model.getTeams()});
			this.$el.find('.js-team-add-container').html(this.addTeamView.render().el);

			this.topPlayersView.remove();
			if (this.model.getTeams().length > 0) {
				this.topPlayersView = new App.View.TopPlayers({collection: this.model.getTeams()});
				this.$el.find('.js-top-players-container').html(this.topPlayersView.render().el);
			}
			return this;
		},

		remove: function () {
			this.undelegateEvents();
			this.$el.empty();
			this.unbind();
			return this;
		},

		destroy: function () {
			this.model.destroy();
		}
	});
});