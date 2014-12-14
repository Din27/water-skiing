$(function () {
	App.Model.Player = Backbone.Model.extend({
		defaults: {
			name: '',
			gender: '',
			slalomTrackIndex: 0, // index of track from SlalomData.js
			slalomBuoysIndex: 0, // index of buoys from SlalomData.js
			slalomResult: 0.0,
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

        // todo validation for scores and results
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
		},

		setSlalomTrackIndex: function (slalomTrackIndex) {
			return this.set({slalomTrackIndex: slalomTrackIndex}, {validate: true});
		},

		getSlalomTrackIndex: function () {
			return this.get('slalomTrackIndex');
		},

		setSlalomBuoysIndex: function (slalomBuoysIndex) {
			return this.set({slalomBuoysIndex: slalomBuoysIndex}, {validate: true});
		},

		getSlalomBuoysIndex: function () {
			return this.get('slalomBuoysIndex');
		},

		setSlalomResult: function (slalomResult) {
			return this.set({slalomResult: slalomResult}, {validate: true});
		},

		getSlalomResult: function () {
			return this.get('slalomResult');
		},

		setSlalomScore: function (slalomScore) {
			return this.set({slalomScore: slalomScore}, {validate: true});
		},

		getSlalomScore: function () {
			return this.get('slalomScore');
		},

		setTricksResult: function (tricksResult) {
			return this.set({tricksResult: tricksResult}, {validate: true});
		},

		getTricksResult: function () {
			return this.get('tricksResult');
		},

		setTricksScore: function (tricksScore) {
			return this.set({tricksScore: tricksScore}, {validate: true});
		},

		getTricksScore: function () {
			return this.get('tricksScore');
		},

		setJumpResult: function (jumpResult) {
			return this.set({jumpResult: jumpResult}, {validate: true});
		},

		getJumpResult: function () {
			return this.get('jumpResult');
		},

		setJumpScore: function (jumpScore) {
			return this.set({jumpScore: jumpScore}, {validate: true});
		},

		getJumpScore: function () {
			return this.get('jumpScore');
		}
	});
});