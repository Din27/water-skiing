$(function () {
	App.Model.Team = Backbone.Model.extend({
		defaults: {
			name: ''
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

			this.bindEvents();
		},


		bindEvents: function() {
			var saveTeamModel = _.bind(function() {
				this.save(null, {success: function() {
					console.log('Команда сохранена');
				}, error: function() {
					console.log('Команда не сохранена');
				}});
			}, this);

			this.getPlayers().on('change', function() {
				_.defer(saveTeamModel);
			});
			this.on('change:name', function (){
				_.defer(saveTeamModel);
			});

			// invalid case
			this.on('invalid', function (model, error) {
				console.log('Ошибка валидации: ' + error);
			});
		},


		parse: function(data){
			if (this.getPlayers()) {
				this.getPlayers().reset(data.players);
			} else {
				this.setPlayers(new App.Collection.Player(data.players));
			}
			//this.bindEvents();
			delete data.players;
			this.trigger('playersReset')
			return data;
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя команды не должно быть пустым'; 
			}
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});
		},

		getName: function () {
			return this.get('name');
		},

		setPlayers: function(players) {
			return this.set({players: players});
		},

		getPlayers: function() {
			return this.get('players');
		}
	});
});