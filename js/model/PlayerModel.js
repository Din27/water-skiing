$(function () {
	App.Model.Player = Backbone.Model.extend({
		defaults: {
			name: '',
			gender: '',
			slalomResult: 0.0,
			slalomTrackIndex: 0, // index of track from SlalomData.js
			slalomBuoysIndex: 0, // index of buoys from SlalomData.js
			slalomScore: 0.0,
			tricksResult: 0,
			tricksScore: 0.0,
			jumpResult: 0.0,
			jumpScore: 0.0
		},

		initialize: function () {
	        this.on("invalid", function (model, error) {
	            console.log('Ошибка валидации: ' + error);
	        });
		},

        // todo setters and getters and validation for scores and results
		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя спортсмена не должно быть пустым';
			}
			if (attrs.gender !== "M" && attrs.gender !== "F" ) {
				return 'Нужно выбрать пол спортсмену';
			}
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});
		},

		getName: function () {
			return this.get('name');
		},

		setGender: function (gender) {
			return this.set({gender: gender}, {validate: true});
		},

		getGender: function () {
			return this.get('gender');
		}

	});
});