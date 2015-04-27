$(function () {
	App.Model.Competition = Backbone.Model.extend({
		defaults: {
			name: '',
			tabName: '',
			slalomMenStartSpeed: 0,
			slalomMenTopSpeed: 0,
			slalomMenTracks: [],
			slalomWomenStartSpeed: 0,
			slalomWomenTopSpeed: 0,
			slalomWomenTracks: []
		},

		initialize: function () {
			if (!this.getTeams()) {
				this.setTeams(new App.Collection.Team());
			}

			this.setSlalomMenTracks(this.generateSlalomTracks(this.getSlalomMenStartSpeed(), this.getSlalomMenTopSpeed()));
			this.setSlalomWomenTracks(this.generateSlalomTracks(this.getSlalomWomenStartSpeed(), this.getSlalomWomenTopSpeed()));

			this.bindEvents();
			_.defer(_.bind(this.updateScoresAndSave, this));
		},

		generateSlalomTracks: function (startSpeed, topSpeed) {
			var tracks = [];
			var i = 0;
			for (var speed = startSpeed; speed < topSpeed; speed += window.SLALOM_SPEED_STEP) {
				tracks[i] = "" + speed;
				i++;
			}
			for (var lengthIndex = 0;
				 lengthIndex < window.SLALOM_LENGTHS.length;
				 lengthIndex++) {
				tracks[i] = "" + speed + " / " + window.SLALOM_LENGTHS[lengthIndex];
				i++;
			}
			return tracks;
		},

		dispose: function () {
			this.getTeams().dispose();
			this.destroy();
			this.off();
		},

		parse: function(data){
			var teamModelsArray = [];
			_.each(data.teams, function(team) {
				var playersArray = team.players;
				delete team.players;
				var teamModel = new App.Model.Team(team);
				teamModel.setPlayers(new App.Collection.Player(playersArray));
				teamModelsArray.push(teamModel);
			});

			if (this.getTeams()) {
				this.getTeams().reset(teamModelsArray);
			} else {
				this.setTeams(new App.Collection.Team(teamModelsArray));
			}
			delete data.teams;
			this.trigger('teamsReset')
			return data;
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя соревнования не должно быть пустым';
			}
			if (!$.trim(attrs.tabName)) {
				return 'Имя вкладки соревнования не должно быть пустым';
			}
		},

		bindEvents: function() {
			this.getTeams().on('add change:colorIndex change:name destroy playersChanged', function() {
				_.defer(_.bind(this.updateScoresAndSave, this));
			}, this);
			this.on('change', function() {
				_.defer(_.bind(this.updateScoresAndSave, this));
			}, this);

			// invalid case
			this.on('invalid', function (model, error) {
				console.log('Ошибка валидации: ' + error);
			});
		},

		updateScoresAndSave: function() {
			this.updateScores();
			this.save(null, {success: function() {
				console.log('Соревнование сохранено');
			}, error: function() {
				console.log('Соревнование не сохранено');
			}});
		},

		updateScores: function() {
			var topResults = {
				slalom: 0,
				tricks: 0,
				jump: 0
			};

			var saveTopResults = function (teams) {
				teams.each(function (team) {
					team.getPlayers().each(function (player) {
						var playerSlalomResult = player.getSlalomResult();
						if (playerSlalomResult > topResults.slalom) topResults.slalom = playerSlalomResult;

						var playerTricksResult = player.getTricksResult();
						if (playerTricksResult > topResults.tricks) topResults.tricks = playerTricksResult;

						var playerJumpResult = player.getJumpResult();
						if (playerJumpResult > topResults.jump) topResults.jump = playerJumpResult;
					});
				});
			};

			var updateScoresForPlayersAndTeams = function(teams) {
				teams.each(function(team) {
					team.getPlayers().each(function(player) {
						updateScoresForPlayer(player);
					});

					updateScoresForTeam(team);
				});
			};

			var updateScoresForPlayer = function(player) {
				var playerSlalomScore = topResults.slalom == 0 ? 0 : ((player.getSlalomResult() * 1000) / topResults.slalom);
				player.setSlalomScore(Math.round(playerSlalomScore * 100) / 100);

				var playerTricksScore = topResults.tricks == 0 ? 0 : ((player.getTricksResult() * 1000) / topResults.tricks);
				player.setTricksScore(Math.round(playerTricksScore * 100) / 100);

				// Men : ((skiers best event score minus 25m) x 1000) / (Best Overall Skiers score minus 25m)
				// Women : ((skiers best event score minus 17m) x 1000) / (Best Overall Skiers score minus 17m)
				var metersMinus = player.getGender() === 'M' ? 25 : 17;
				var playerJumpResultWithNegative = ((player.getJumpResult() - metersMinus) * 1000) / (topResults.jump - metersMinus);
				// A skiers overall score in jumping shall not be reduced below zero.
				var playerJumpResult = (playerJumpResultWithNegative < 0 || _.isNaN(playerJumpResultWithNegative) || player.getJumpResult() == 0) ? 0 : playerJumpResultWithNegative;
				player.setJumpScore(Math.round(playerJumpResult * 100) / 100);

				player.setOverallScore(player.getSlalomScore() + player.getTricksScore() + player.getJumpScore());
			};

			var updateScoresForTeam = function(team) {
				// sorting by scores
				var teamPlayersSlalomSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getSlalomScore(); });
				var teamPlayersTricksSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getTricksScore(); });
				var teamPlayersJumpSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getJumpScore(); });

				// finding scoring and not scoring players
				var teamPlayersSlalomScoring = teamPlayersSlalomSorted.slice(0, 3);
				var teamPlayersSlalomNotScoring = teamPlayersSlalomSorted.slice(3);
				var teamPlayersTricksScoring = teamPlayersTricksSorted.slice(0, 3);
				var teamPlayersTricksNotScoring = teamPlayersTricksSorted.slice(3);
				var teamPlayersJumpScoring = teamPlayersJumpSorted.slice(0, 3);
				var teamPlayersJumpNotScoring = teamPlayersJumpSorted.slice(3);

				// setting info to players to light up scoring players on view
				_.each(teamPlayersSlalomScoring, function(player) { player.setIsSlalomInTeamScore(true); });
				_.each(teamPlayersSlalomNotScoring, function(player) { player.setIsSlalomInTeamScore(false); });
				_.each(teamPlayersTricksScoring, function(player) { player.setIsTricksInTeamScore(true); });
				_.each(teamPlayersTricksNotScoring, function(player) { player.setIsTricksInTeamScore(false); });
				_.each(teamPlayersJumpScoring, function(player) { player.setIsJumpInTeamScore(true); });
				_.each(teamPlayersJumpNotScoring, function(player) { player.setIsJumpInTeamScore(false); });

				// setting scores to teams
				team.setSlalomScore(_.reduce(teamPlayersSlalomScoring, function(sum, player){ return sum + player.getSlalomScore(); }, 0));
				team.setTricksScore(_.reduce(teamPlayersTricksScoring, function(sum, player){ return sum + player.getTricksScore(); }, 0));
				team.setJumpScore(_.reduce(teamPlayersJumpScoring, function(sum, player){ return sum + player.getJumpScore(); }, 0));
				team.setOverallScore(team.getSlalomScore() + team.getTricksScore() + team.getJumpScore());
			};

			saveTopResults(this.getTeams());
			updateScoresForPlayersAndTeams(this.getTeams());
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});
		},

		getName: function () {
			return this.get('name');
		},

		setTabName: function (tabName) {
			return this.set({tabName: tabName}, {validate: true});
		},

		getTabName: function () {
			return this.get('tabName');
		},

		setTeams: function(teams) {
			return this.set({teams: teams});
		},

		getTeams: function() {
			return this.get('teams');
		},

		setSlalomMenStartSpeed: function(slalomMenStartSpeed) {
			return this.set({slalomMenStartSpeed: slalomMenStartSpeed});
		},

		getSlalomMenStartSpeed: function() {
			return this.get('slalomMenStartSpeed');
		},

		setSlalomMenTopSpeed: function(slalomMenTopSpeed) {
			return this.set({slalomMenTopSpeed: slalomMenTopSpeed});
		},

		getSlalomMenTopSpeed: function() {
			return this.get('slalomMenTopSpeed');
		},

		setSlalomWomenStartSpeed: function(slalomWomenStartSpeed) {
			return this.set({slalomWomenStartSpeed: slalomWomenStartSpeed});
		},

		getSlalomWomenStartSpeed: function() {
			return this.get('slalomWomenStartSpeed');
		},

		setSlalomWomenTopSpeed: function(slalomWomenTopSpeed) {
			return this.set({slalomWomenTopSpeed: slalomWomenTopSpeed});
		},

		getSlalomWomenTopSpeed: function() {
			return this.get('slalomWomenTopSpeed');
		},

		setSlalomMenTracks: function(slalomMenTracks) {
			return this.set({slalomMenTracks: slalomMenTracks});
		},

		getSlalomMenTracks: function() {
			return this.get('slalomMenTracks');
		},

		setSlalomWomenTracks: function(slalomWomenTracks) {
			return this.set({slalomWomenTracks: slalomWomenTracks});
		},

		getSlalomWomenTracks: function() {
			return this.get('slalomWomenTracks');
		}
	});
});