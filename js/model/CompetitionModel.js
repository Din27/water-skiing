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
			slalomWomenTracks: [],
			jumpMenDeduction: 0,
			jumpWomenDeduction: 0,
			
			competitionType: window.COMPETITION_TYPES.EUROPE,
			worldRecordSlalomMen: 0,
			worldRecordSlalomWomen: 0,
			worldRecordTricksMen: 0,
			worldRecordTricksWomen: 0,
			worldRecordJumpMen: 0,
			worldRecordJumpWomen: 0
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
				slalomMen: 0,
				tricksMen: 0,
				jumpMen: 0,
				slalomWomen: 0,
				tricksWomen: 0,
				jumpWomen: 0
			};

			var getTopSlalomResult = function (player) {
				return player.getGender() === 'M' ? topResults.slalomMen : topResults.slalomWomen;
			};
			var getTopTricksResult = function (player) {
				return player.getGender() === 'M' ? topResults.tricksMen : topResults.tricksWomen;
			};
			var getTopJumpResult = function (player) {
				return player.getGender() === 'M' ? topResults.jumpMen : topResults.jumpWomen;
			};

			var saveTopResults = function (competition) {
				if (competition.getCompetitionType() === COMPETITION_TYPES.EUROPE) {
					topResults.slalomMen = competition.getWorldRecordSlalomMen();
					topResults.tricksMen = competition.getWorldRecordTricksMen();
					topResults.jumpMen = competition.getWorldRecordJumpMen();
					topResults.slalomWomen = competition.getWorldRecordSlalomWomen();
					topResults.tricksWomen = competition.getWorldRecordTricksWomen();
					topResults.jumpWomen = competition.getWorldRecordJumpWomen();
				} else if (competition.getCompetitionType() === COMPETITION_TYPES.CABELSKI) {
					competition.getTeams().each(function (team) {
						team.getPlayers().each(function (player) {
							var playerSlalomResult = player.getSlalomResult();
							if (player.getGender() === 'M' && playerSlalomResult > topResults.slalomMen) topResults.slalomMen = playerSlalomResult;
							if (player.getGender() === 'F' && playerSlalomResult > topResults.slalomWomen) topResults.slalomWomen = playerSlalomResult;

							var playerTricksResult = player.getTricksResult();
							if (player.getGender() === 'M' && playerTricksResult > topResults.tricksMen) topResults.tricksMen = playerTricksResult;
							if (player.getGender() === 'F' && playerTricksResult > topResults.tricksWomen) topResults.tricksWomen = playerTricksResult;

							var playerJumpResult = player.getJumpResult();
							if (player.getGender() === 'M' && playerJumpResult > topResults.jumpMen) topResults.jumpMen = playerJumpResult;
							if (player.getGender() === 'F' && playerJumpResult > topResults.jumpWomen) topResults.jumpWomen = playerJumpResult;
						});
					});
				}
			};

			var updateScoresForPlayersAndTeams = function(competition) {
				competition.getTeams().each(function(team) {
					team.getPlayers().each(function(player) {
						updateScoresForPlayer(player, competition);
					});

					updateScoresForTeam(team);
				});
			};

			var updateScoresForPlayer = function(player, competition) {
				// slalom
				var playerSlalomScore = getTopSlalomResult(player) == 0
					? 0
					: (player.getSlalomResult() * 1000) / getTopSlalomResult(player);
				player.setSlalomScore(Math.round(playerSlalomScore * 100) / 100);

				// tricks
				var playerTricksScore = getTopTricksResult(player) == 0
					? 0
					: (player.getTricksResult() * 1000) / getTopTricksResult(player);
				player.setTricksScore(Math.round(playerTricksScore * 100) / 100);

				// jumps
				var jumpDeduction = player.getGender() === 'M' ? competition.getJumpMenDeduction() : competition.getJumpWomenDeduction();
				var playerJumpResultWithNegative = ((player.getJumpResult() - jumpDeduction) * 1000) / (getTopJumpResult(player) - jumpDeduction);
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

			saveTopResults(this);
			updateScoresForPlayersAndTeams(this);
		},

		getTopPlayers: function (gender) {
			var genderPlayers = [];
			this.getTeams().each(function (team) {
				team.getPlayers().each(function (player) {
					if (player.getGender() === gender) {
						genderPlayers.push(player);
					}
				});
			});
			var sortedGenderPlayers = _.sortBy(genderPlayers, function(player) { return - player.getOverallScore(); });
			return sortedGenderPlayers;
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
		},

		setJumpMenDeduction: function(jumpMenDeduction) {
			return this.set({jumpMenDeduction: jumpMenDeduction});
		},

		getJumpMenDeduction: function() {
			return this.get('jumpMenDeduction');
		},
		
		setJumpWomenDeduction: function(jumpWomenDeduction) {
			return this.set({jumpWomenDeduction: jumpWomenDeduction});
		},

		getJumpWomenDeduction: function() {
			return this.get('jumpWomenDeduction');
		},

		
		
		setCompetitionType: function(competitionType) {
			return this.set({competitionType: competitionType});
		},

		getCompetitionType: function() {
			return this.get('competitionType');
		},
		
		setWorldRecordSlalomMen: function(worldRecordSlalomMen) {
			return this.set({worldRecordSlalomMen: worldRecordSlalomMen});
		},

		getWorldRecordSlalomMen: function() {
			return this.get('worldRecordSlalomMen');
		},

		setWorldRecordSlalomWomen: function(worldRecordSlalomWomen) {
			return this.set({worldRecordSlalomWomen: worldRecordSlalomWomen});
		},

		getWorldRecordSlalomWomen: function() {
			return this.get('worldRecordSlalomWomen');
		},

		setWorldRecordTricksMen: function(worldRecordTricksMen) {
			return this.set({worldRecordTricksMen: worldRecordTricksMen});
		},

		getWorldRecordTricksMen: function() {
			return this.get('worldRecordTricksMen');
		},

		setWorldRecordTricksWomen: function(worldRecordTricksWomen) {
			return this.set({worldRecordTricksWomen: worldRecordTricksWomen});
		},

		getWorldRecordTricksWomen: function() {
			return this.get('worldRecordTricksWomen');
		},

		setWorldRecordJumpMen: function(worldRecordJumpMen) {
			return this.set({worldRecordJumpMen: worldRecordJumpMen});
		},

		getWorldRecordJumpMen: function() {
			return this.get('worldRecordJumpMen');
		},

		setWorldRecordJumpWomen: function(worldRecordJumpWomen) {
			return this.set({worldRecordJumpWomen: worldRecordJumpWomen});
		},

		getWorldRecordJumpWomen: function() {
			return this.get('worldRecordJumpWomen');
		}
	});
});