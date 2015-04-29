$(function () {
	App.Model.Competition = Backbone.Model.extend({
		defaults: {
			id: 0,
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
			worldRecordJumpWomen: 0,

			topResultSlalomMen: 0,
			topResultSlalomWomen: 0,
			topResultTricksMen: 0,
			topResultTricksWomen: 0,
			topResultJumpMen: 0,
			topResultJumpWomen: 0,


			topIndividualResultSlalomMen: 0,
			topIndividualResultSlalomWomen: 0,
			topIndividualResultTricksMen: 0,
			topIndividualResultTricksWomen: 0,
			topIndividualResultJumpMen: 0,
			topIndividualResultJumpWomen: 0
		},

		initialize: function () {
			if (!this.getTeams()) {
				this.setTeams(new App.Collection.Team());
			}

			this.setSlalomMenTracks(this.generateSlalomTracks(this.getSlalomMenStartSpeed(), this.getSlalomMenTopSpeed()));
			this.setSlalomWomenTracks(this.generateSlalomTracks(this.getSlalomWomenStartSpeed(), this.getSlalomWomenTopSpeed()));

			this.bindEvents();
			_.defer(_.bind(this.updateAllScoresAndSave, this));
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
			this.trigger('teamsReset');
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
			this.getTeams().on('change:colorIndex change:name playersInfoChanged', function() {
				_.defer(_.bind(this.saveCompetition, this));
			}, this);

			// TODO can be optimized now
			this.getTeams().on('add destroy playersResultsChanged', function() {
				_.defer(_.bind(this.updateAllScoresAndSave, this));
			}, this);
			this.on('change:worldRecordSlalomMen change:worldRecordSlalomWomen change:worldRecordTricksMen change:worldRecordTricksWomen change:worldRecordJumpMen change:worldRecordJumpWomen', function() {
				_.defer(_.bind(this.updateAllScoresAndSave, this));
			}, this);

			this.getTeams().on('playersIndividualResultsChanged', function() {
				_.defer(_.bind(this.updateIndividualScoresAndSave, this));
			}, this);

			// invalid case
			this.on('invalid', function (model, error) {
				console.log('Ошибка валидации: ' + error);
			});
		},

		getNumberOfPlayers: function() {
			if (this.getCompetitionType() === window.COMPETITION_TYPES.EUROPE) {
				return 4;
			} else {
				return 6;
			}
		},

		updateAllScoresAndSave: function() {
			this.updateScores();
			this.updateIndividualScores();
			this.saveCompetition();
		},

		updateIndividualScoresAndSave: function() {
			this.updateIndividualScores();
			this.saveCompetition();
		},

		saveCompetition: function() {
			var name = this.getName();
			this.save(null, {success: function() {
				console.log(name + ': Соревнование сохранено');
			}, error: function() {
				console.log(name + ': Соревнование не сохранено');
			}});
		},

		getTopSlalomResult: function (player) {
			return player.getGender() === 'M' ? this.getTopResultSlalomMen() : this.getTopResultSlalomWomen();
		},
		getTopTricksResult: function (player) {
			return player.getGender() === 'M' ? this.getTopResultTricksMen() : this.getTopResultTricksWomen();
		},
		getTopJumpResult: function (player) {
			return player.getGender() === 'M' ? this.getTopResultJumpMen() : this.getTopResultJumpWomen();
		},
		getTopIndividualSlalomResult: function (player) {
			return player.getGender() === 'M' ? this.getTopIndividualResultSlalomMen() : this.getTopIndividualResultSlalomWomen();
		},
		getTopIndividualTricksResult: function (player) {
			return player.getGender() === 'M' ? this.getTopIndividualResultTricksMen() : this.getTopIndividualResultTricksWomen();
		},
		getTopIndividualJumpResult: function (player) {
			return player.getGender() === 'M' ? this.getTopIndividualResultJumpMen() : this.getTopIndividualResultJumpWomen();
		},

		updateScores: function() {
			this.saveTopResults();
			var competition = this;
			this.getTeams().each(function(team) {
				team.getPlayers().each(function(player) {
					competition.updateScoresForPlayer(player);
				});

				competition.updateScoresForTeam(team);
			});
			console.log(this.getName() + ': Командные скоры игроков и команд обновлены');
		},

		updateIndividualScores: function() {
			this.saveTopResults();
			var competition = this;
			this.getTeams().each(function(team) {
				team.getPlayers().each(function(player) {
					competition.updateIndividualScoresForPlayer(player);
				});
			});
			console.log(this.getName() + ': Индивидуальные скоры обновлены');
		},
		
		saveTopResults: function () {
			if (this.getCompetitionType() === COMPETITION_TYPES.EUROPE) {
				this.setTopResultSlalomMen(this.getWorldRecordSlalomMen());
				this.setTopResultSlalomWomen(this.getWorldRecordSlalomWomen());
				this.setTopResultTricksMen(this.getWorldRecordTricksMen());
				this.setTopResultTricksWomen(this.getWorldRecordTricksWomen());
				this.setTopResultJumpMen(this.getWorldRecordJumpMen());
				this.setTopResultJumpWomen(this.getWorldRecordJumpWomen());
				this.setTopIndividualResultSlalomMen(this.getWorldRecordSlalomMen());
				this.setTopIndividualResultSlalomWomen(this.getWorldRecordSlalomWomen());
				this.setTopIndividualResultTricksMen(this.getWorldRecordTricksMen());
				this.setTopIndividualResultTricksWomen(this.getWorldRecordTricksWomen());
				this.setTopIndividualResultJumpMen(this.getWorldRecordJumpMen());
				this.setTopIndividualResultJumpWomen(this.getWorldRecordJumpWomen());
			} else if (this.getCompetitionType() === COMPETITION_TYPES.CABELSKI) {
				this.setTopResultSlalomMen(0);
				this.setTopResultSlalomWomen(0);
				this.setTopResultTricksMen(0);
				this.setTopResultTricksWomen(0);
				this.setTopResultJumpMen(0);
				this.setTopResultJumpWomen(0);
				this.setTopIndividualResultSlalomMen(0);
				this.setTopIndividualResultSlalomWomen(0);
				this.setTopIndividualResultTricksMen(0);
				this.setTopIndividualResultTricksWomen(0);
				this.setTopIndividualResultJumpMen(0);
				this.setTopIndividualResultJumpWomen(0);
				var competition = this;
				this.getTeams().each(function (team) {
					team.getPlayers().each(function (player) {
						var playerSlalomResult = player.getSlalomResult();
						if (player.getGender() === 'M' && playerSlalomResult > competition.getTopResultSlalomMen()) competition.setTopResultSlalomMen(playerSlalomResult);
						if (player.getGender() === 'F' && playerSlalomResult > competition.getTopResultSlalomWomen()) competition.setTopResultSlalomWomen(playerSlalomResult);

						var playerTricksResult = player.getTricksResult();
						if (player.getGender() === 'M' && playerTricksResult > competition.getTopResultTricksMen()) competition.setTopResultTricksMen(playerTricksResult);
						if (player.getGender() === 'F' && playerTricksResult > competition.getTopResultTricksWomen()) competition.setTopResultTricksWomen(playerTricksResult);

						var playerJumpResult = player.getJumpResult();
						if (player.getGender() === 'M' && playerJumpResult > competition.getTopResultJumpMen()) competition.setTopResultJumpMen(playerJumpResult);
						if (player.getGender() === 'F' && playerJumpResult > competition.getTopResultJumpWomen()) competition.setTopResultJumpWomen(playerJumpResult);

						var playerIndividualSlalomResult = player.getIndividualSlalomResult();
						if (player.getGender() === 'M' && playerIndividualSlalomResult > competition.getTopIndividualResultSlalomMen()) competition.setTopIndividualResultSlalomMen(playerIndividualSlalomResult);
						if (player.getGender() === 'F' && playerIndividualSlalomResult > competition.getTopIndividualResultSlalomWomen()) competition.setTopIndividualResultSlalomWomen(playerIndividualSlalomResult);

						var playerIndividualTricksResult = player.getIndividualTricksResult();
						if (player.getGender() === 'M' && playerIndividualTricksResult > competition.getTopIndividualResultTricksMen()) competition.setTopIndividualResultTricksMen(playerIndividualTricksResult);
						if (player.getGender() === 'F' && playerIndividualTricksResult > competition.getTopIndividualResultTricksWomen()) competition.setTopIndividualResultTricksWomen(playerIndividualTricksResult);

						var playerIndividualJumpResult = player.getIndividualJumpResult();
						if (player.getGender() === 'M' && playerIndividualJumpResult > competition.getTopIndividualResultJumpMen()) competition.setTopIndividualResultJumpMen(playerIndividualJumpResult);
						if (player.getGender() === 'F' && playerIndividualJumpResult > competition.getTopIndividualResultJumpWomen()) competition.setTopIndividualResultJumpWomen(playerIndividualJumpResult);

					});
				});
			}
		},

		updateScoresForPlayer: function(player) {
			player.setSlalomScore(this.calculateSlalomScore(player, player.getSlalomResult(), this.getTopSlalomResult(player)));
			player.setTricksScore(this.calculateTricksScore(player, player.getTricksResult(), this.getTopTricksResult(player)));
			player.setJumpScore(this.calculateJumpScore(player, player.getJumpResult(), this.getTopJumpResult(player)));
			player.setOverallScore(player.getSlalomScore() + player.getTricksScore() + player.getJumpScore());
		},

		updateIndividualScoresForPlayer: function(player) {
			player.setIndividualSlalomScore(this.calculateSlalomScore(player, player.getIndividualSlalomResult(), this.getTopIndividualSlalomResult(player)));
			player.setIndividualTricksScore(this.calculateTricksScore(player, player.getIndividualTricksResult(), this.getTopIndividualTricksResult(player)));
			player.setIndividualJumpScore(this.calculateJumpScore(player, player.getIndividualJumpResult(), this.getTopIndividualJumpResult(player)));
			player.setIndividualOverallScore(player.getIndividualSlalomScore() + player.getIndividualTricksScore() + player.getIndividualJumpScore());
		},

		// no getters of results in this method! pass to params
		calculateSlalomScore: function(player, playerSlalomResult, topSlalomResult) {
			var playerSlalomScore = topSlalomResult == 0
				? 0
				: (playerSlalomResult * 1000) / topSlalomResult;
			return Math.round(playerSlalomScore * 100) / 100;
		},

		// no getters of results in this method! pass to params
		calculateTricksScore: function(player, playerTricksResult, topTricksResult) {
			var playerTricksScore = topTricksResult == 0
				? 0
				: (playerTricksResult * 1000) / topTricksResult;
			return Math.round(playerTricksScore * 100) / 100;
		},

		// no getters of results in this method! pass to params
		calculateJumpScore: function(player, playerJumpResult, topJumpResult) {
			var jumpDeduction = player.getGender() === 'M' ? this.getJumpMenDeduction() : this.getJumpWomenDeduction();
			var playerJumpScoreWithNegative = ((playerJumpResult - jumpDeduction) * 1000) / (topJumpResult - jumpDeduction);
			// A skiers overall score in jumping shall not be reduced below zero.
			var playerJumpScore = (playerJumpScoreWithNegative < 0 || _.isNaN(playerJumpScoreWithNegative) || playerJumpResult == 0) ? 0 : playerJumpScoreWithNegative;
			return Math.round(playerJumpScore * 100) / 100;
		},

		updateScoresForTeam: function(team) {
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
			return _.sortBy(genderPlayers, function(player) { return - player.getIndividualOverallScore(); });
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
		},

		setTopResultSlalomMen: function(topResultSlalomMen) {
			return this.set({topResultSlalomMen: topResultSlalomMen});
		},

		getTopResultSlalomMen: function() {
			return this.get('topResultSlalomMen');
		},

		setTopResultSlalomWomen: function(topResultSlalomWomen) {
			return this.set({topResultSlalomWomen: topResultSlalomWomen});
		},

		getTopResultSlalomWomen: function() {
			return this.get('topResultSlalomWomen');
		},

		setTopResultTricksMen: function(topResultTricksMen) {
			return this.set({topResultTricksMen: topResultTricksMen});
		},

		getTopResultTricksMen: function() {
			return this.get('topResultTricksMen');
		},

		setTopResultTricksWomen: function(topResultTricksWomen) {
			return this.set({topResultTricksWomen: topResultTricksWomen});
		},

		getTopResultTricksWomen: function() {
			return this.get('topResultTricksWomen');
		},

		setTopResultJumpMen: function(topResultJumpMen) {
			return this.set({topResultJumpMen: topResultJumpMen});
		},

		getTopResultJumpMen: function() {
			return this.get('topResultJumpMen');
		},

		setTopResultJumpWomen: function(topResultJumpWomen) {
			return this.set({topResultJumpWomen: topResultJumpWomen});
		},

		getTopResultJumpWomen: function() {
			return this.get('topResultJumpWomen');
		},

		setTopIndividualResultSlalomMen: function (topIndividualResultSlalomMen) {
			return this.set({topIndividualResultSlalomMen: topIndividualResultSlalomMen}, {validate: true});
		},

		getTopIndividualResultSlalomMen: function () {
			return this.get('topIndividualResultSlalomMen');
		},

		setTopIndividualResultSlalomWomen: function (topIndividualResultSlalomWomen) {
			return this.set({topIndividualResultSlalomWomen: topIndividualResultSlalomWomen}, {validate: true});
		},

		getTopIndividualResultSlalomWomen: function () {
			return this.get('topIndividualResultSlalomWomen');
		},

		setTopIndividualResultTricksMen: function (topIndividualResultTricksMen) {
			return this.set({topIndividualResultTricksMen: topIndividualResultTricksMen}, {validate: true});
		},

		getTopIndividualResultTricksMen: function () {
			return this.get('topIndividualResultTricksMen');
		},

		setTopIndividualResultTricksWomen: function (topIndividualResultTricksWomen) {
			return this.set({topIndividualResultTricksWomen: topIndividualResultTricksWomen}, {validate: true});
		},

		getTopIndividualResultTricksWomen: function () {
			return this.get('topIndividualResultTricksWomen');
		},

		setTopIndividualResultJumpMen: function (topIndividualResultJumpMen) {
			return this.set({topIndividualResultJumpMen: topIndividualResultJumpMen}, {validate: true});
		},

		getTopIndividualResultJumpMen: function () {
			return this.get('topIndividualResultJumpMen');
		},

		setTopIndividualResultJumpWomen: function (topIndividualResultJumpWomen) {
			return this.set({topIndividualResultJumpWomen: topIndividualResultJumpWomen}, {validate: true});
		},

		getTopIndividualResultJumpWomen: function () {
			return this.get('topIndividualResultJumpWomen');
		}
	});
});