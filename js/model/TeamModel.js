$(function () {
	App.Model.Team = Backbone.Model.extend({
		defaults: {
			name: '',
			slalomScore: 0,
			tricksScore: 0,
			jumpScore: 0,
			overallScore: 0,
			colorIndex: 0
		},

		initialize: function () {
			var defaultPlayers = new App.Collection.Player([
				{ name: "Лыжник 1", gender: "M" },
				{ name: "Лыжник 2", gender: "M" },
				{ name: "Лыжник 3", gender: "M" },
				{ name: "Лыжник 4", gender: "M" }
			]);
			if (!this.getPlayers()) {
				this.setPlayers(defaultPlayers);
			}

			// invalid case
			this.on('invalid', function (model, error) {
				console.log('Ошибка валидации: ' + error);
			});
		},

		dispose: function(success, error) {
			this.getPlayers().dispose();
			this.destroy(success, error);
			this.off();
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя команды не должно быть пустым';
			}
		},

		bindPlayersEvents: function() {
			this.getPlayers().on('change:name change:gender change:slalomResult change:tricksResult change:jumpResult', function(){
				this.trigger('playersChanged');
			}, this);
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});
		},

		getName: function () {
			return this.get('name');
		},

		setPlayers: function(players) {
			this.set({players: players});
			this.bindPlayersEvents();
			return this;
		},

		getPlayers: function() {
			return this.get('players');
		},

		setSlalomScore: function (slalomScore) {
			return this.set({slalomScore: slalomScore}, {validate: true});
		},

		getSlalomScore: function () {
			return this.get('slalomScore');
		},

		setTricksScore: function (tricksScore) {
			return this.set({tricksScore: tricksScore}, {validate: true});
		},

		getTricksScore: function () {
			return this.get('tricksScore');
		},

		setJumpScore: function (jumpScore) {
			return this.set({jumpScore: jumpScore}, {validate: true});
		},

		getJumpScore: function () {
			return this.get('jumpScore');
		},

		setOverallScore: function (overallScore) {
			return this.set({overallScore: overallScore}, {validate: true});
		},

		getOverallScore: function () {
			return this.get('overallScore');
		},

		setColorIndex: function (colorIndex) {
			return this.set({colorIndex: colorIndex}, {validate: true});
		},

		getColorIndex: function () {
			return this.get('colorIndex');
		}
	});
});