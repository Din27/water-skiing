$(function () {
	App.View.Competition = Backbone.View.extend({
		//todo remove events here, dispose
		initialize: function () {
			this.addTeamView = new App.View.AddTeam({collection: this.model.getTeams()});
			this.teamCollectionView = new App.View.TeamCollection({collection: this.model.getTeams(), slalomMenTracks: this.model.getSlalomMenTracks(), slalomWomenTracks: this.model.getSlalomWomenTracks()});
			this.topPlayersMenView = new App.View.TopPlayers({collection: this.model.getTeams(), gender: 'M', slalomMenTracks: this.model.getSlalomMenTracks(), slalomWomenTracks: this.model.getSlalomWomenTracks()});
			this.topPlayersWomenView = new App.View.TopPlayers({collection: this.model.getTeams(), gender: 'W', slalomMenTracks: this.model.getSlalomMenTracks(), slalomWomenTracks: this.model.getSlalomWomenTracks()});
			this.model.on('teamsReset', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		template: template('competitionTemplate'),

		_selectors: {
			recordSlalomMen: '.js-world-record-slalom-men',
			recordTricksMen: '.js-world-record-tricks-men',
			recordJumpMen: '.js-world-record-jump-men',
			recordSlalomWomen: '.js-world-record-slalom-women',
			recordTricksWomen: '.js-world-record-tricks-women',
			recordJumpWomen: '.js-world-record-jump-women'
		},

		events: function () {
			var _events = {};
			_events['change ' + this._selectors.recordSlalomMen] = 'editRecordSlalomMen';
			_events['change ' + this._selectors.recordTricksMen] = 'editRecordTricksMen';
			_events['change ' + this._selectors.recordJumpMen] = 'editRecordJumpMen';
			_events['change ' + this._selectors.recordSlalomWomen] = 'editRecordSlalomWomen';
			_events['change ' + this._selectors.recordTricksWomen] = 'editRecordTricksWomen';
			_events['change ' + this._selectors.recordJumpWomen] = 'editRecordJumpWomen';
			return _events;
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find('.js-teams-list').html(this.teamCollectionView.render().el);

			this.addTeamView.remove();
			this.addTeamView = new App.View.AddTeam({collection: this.model.getTeams()});
			this.$el.find('.js-team-add-container').html(this.addTeamView.render().el);

			this.topPlayersMenView.remove();
			this.topPlayersWomenView.remove();

			var topPlayersMen = this.model.getTopPlayers('M');
			if (topPlayersMen.length > 0) {
				this.topPlayersMenView = new App.View.TopPlayers({collection: topPlayersMen, genderName: 'Мужчины', slalomMenTracks: this.model.getSlalomMenTracks(), slalomWomenTracks: this.model.getSlalomWomenTracks()});
				this.$el.find('.js-top-players-men-container').html(this.topPlayersMenView.render().el);
			}

			var topPlayersWomen = this.model.getTopPlayers('F');
			if (topPlayersWomen.length > 0) {
				this.topPlayersWomenView = new App.View.TopPlayers({collection: topPlayersWomen, genderName: 'Женщины', slalomMenTracks: this.model.getSlalomMenTracks(), slalomWomenTracks: this.model.getSlalomWomenTracks()});
				this.$el.find('.js-top-players-women-container').html(this.topPlayersWomenView.render().el);
			}
			return this;
		},

		editRecordSlalomMen: function () {
			var recordSlalomMen = +$(this.el).find(this._selectors.recordSlalomMen).val();
			this.model.setWorldRecordSlalomMen(recordSlalomMen);
			this.render();
		},
		
		editRecordTricksMen: function () {
			var recordTricksMen = +$(this.el).find(this._selectors.recordTricksMen).val();
			this.model.setWorldRecordTricksMen(recordTricksMen);
			this.render();
		},
		
		editRecordJumpMen: function () {
			var recordJumpMen = +$(this.el).find(this._selectors.recordJumpMen).val();
			this.model.setWorldRecordJumpMen(recordJumpMen);
			this.render();
		},
		
		editRecordSlalomWomen:function () {
			var recordSlalomWomen = +$(this.el).find(this._selectors.recordSlalomWomen).val();
			this.model.setWorldRecordSlalomWomen(recordSlalomWomen);
			this.render();
		},
		
		editRecordTricksWomen:function () {
			var recordTricksWomen = +$(this.el).find(this._selectors.recordTricksWomen).val();
			this.model.setWorldRecordTricksWomen(recordTricksWomen);
			this.render();
		},
		
		editRecordJumpWomen:function () {
			var recordJumpWomen = +$(this.el).find(this._selectors.recordJumpWomen).val();
			this.model.setWorldRecordJumpWomen(recordJumpWomen);
			this.render();
		},

		remove: function () {
			this.undelegateEvents();
			this.stopListening();
			this.addTeamView.remove();
			this.teamCollectionView.remove();
			this.topPlayersMenView.remove();
			this.topPlayersWomenView.remove();
			this.$el.empty();
			this.unbind();
			return this;
		},

		dispose: function (e) {
			e.preventDefault();
			this.model.dispose({success: _.bind(function(model, response) {
				this.remove();
				console.log('Команда удалена');
			}, this), error: function() {
				console.log('Команда не удалена');
			}});
		}
	});
});