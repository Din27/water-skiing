$(function () {
	App.Model.Player = Backbone.Model.extend({
		defaults: {
			name: '',
			gender: '',
			teamName: '',
			colorIndex: '',

			slalomTrackIndex: 0, // index of track from SlalomData.js
			slalomBuoysIndex: 0, // index of buoys from SlalomData.js
			slalomResult: 0.0,
			slalomScore: 0.00,
			isSlalomInTeamScore: false,

			tricksResult: 0,
			tricksScore: 0.00,
			isTricksInTeamScore: false,

			jumpResult: 0.0,
			jumpScore: 0.00,
			isJumpInTeamScore: false,

			overallScore: 0.00
		},

		initialize: function () {
	        this.on('invalid', function (model, error) {
	            console.log('Ошибка валидации: ' + error);
	        });
		},

		dispose: function() {
			this.destroy();
			this.off();
		},

        // todo validation for scores and results
		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя спортсмена не должно быть пустым';
			}
			if (!$.trim(attrs.teamName)) {
				return 'Имя команлы спортсмена не должно быть пустым';
			}
			if (attrs.gender !== "M" && attrs.gender !== "F" ) {
				return 'Нужно выбрать пол спортсмену';
			}
		},

		updateSlalomResult: function () {
			return this.setSlalomResult(this.getSlalomTrackIndex() * 6 + window.SLALOM_BUOYS[this.getSlalomBuoysIndex()]);
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
			this.set({slalomTrackIndex: slalomTrackIndex}, {validate: true});
			this.updateSlalomResult();
			return this;
		},

		getSlalomTrackIndex: function () {
			return this.get('slalomTrackIndex');
		},

		setSlalomBuoysIndex: function (slalomBuoysIndex) {
			this.set({slalomBuoysIndex: slalomBuoysIndex}, {validate: true});
			this.updateSlalomResult();
			return this;
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

		setIsSlalomInTeamScore: function (isSlalomInTeamScore) {
			return this.set({isSlalomInTeamScore: isSlalomInTeamScore}, {validate: true});
		},

		getIsSlalomInTeamScore: function () {
			return this.get('isSlalomInTeamScore');
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

		setIsTricksInTeamScore: function (isTricksInTeamScore) {
			return this.set({isTricksInTeamScore: isTricksInTeamScore}, {validate: true});
		},

		getIsTricksInTeamScore: function () {
			return this.get('isTricksInTeamScore');
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
		},

		setIsJumpInTeamScore: function (isJumpInTeamScore) {
			return this.set({isJumpInTeamScore: isJumpInTeamScore}, {validate: true});
		},

		getIsJumpInTeamScore: function () {
			return this.get('isJumpInTeamScore');
		},

		setOverallScore: function (overallScore) {
			return this.set({overallScore: overallScore}, {validate: true});
		},

		getOverallScore: function () {
			return this.get('overallScore');
		},

		setTeamName: function (teamName) {
			return this.set({teamName: teamName}, {validate: true});
		},

		getTeamName: function () {
			return this.get('teamName');
		},

		setColorIndex: function (colorIndex) {
			return this.set({colorIndex: colorIndex}, {validate: true});
		},

		getColorIndex: function () {
			return this.get('colorIndex');
		}
	});
});