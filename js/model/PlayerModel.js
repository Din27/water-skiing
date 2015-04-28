$(function () {
	App.Model.Player = Backbone.Model.extend({
		defaults: {
			// general info
			name: '',
			gender: '',
			teamName: '',
			colorIndex: '',

			// team results/scores
			slalomTrackIndex: 0, // index of track from SlalomData.js
			slalomBuoysIndex: 0, // index of buoys from SlalomData.js
			slalomResult: 0.00,
			slalomScore: 0.00,
			isSlalomInTeamScore: false,

			tricksResult: 0,
			tricksScore: 0.00,
			isTricksInTeamScore: false,

			jumpResult: 0.0,
			jumpScore: 0.00,
			isJumpInTeamScore: false,

			overallScore: 0.00,

			// individual results/scores
			individualSlalomTrackIndex: 0,
			individualSlalomBuoysIndex: 0,
			individualSlalomResult: 0.00,
			individualSlalomScore: 0.00,

			individualTricksResult: 0,
			individualTricksScore: 0.00,

			individualJumpResult: 0.0,
			individualJumpScore: 0.00,

			individualOverallScore: 0.00
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
			if (typeof attrs.tricksResult !== 'number' || _.isNaN (attrs.tricksResult) || attrs.tricksResult < 0) {
				return 'Результат фигурного катания должен быть положительным числом';
			}
			if (typeof attrs.jumpResult !== 'number' || _.isNaN (attrs.jumpResult) || attrs.jumpResult < 0) {
				return 'Результат трамплина должен быть положительным числом';
			}
			if (typeof attrs.individualTricksResult !== 'number' || _.isNaN (attrs.individualTricksResult) || attrs.individualTricksResult < 0) {
				return 'Результат индивидуального фигурного катания должен быть положительным числом';
			}
			if (typeof attrs.individualJumpResult !== 'number' || _.isNaN (attrs.individualJumpResult) || attrs.individualJumpResult < 0) {
				return 'Результат индивидуального трамплина должен быть положительным числом';
			}
		},

		updateSlalomResult: function () {
			return this.setSlalomResult(this.getSlalomTrackIndex() * 6 + window.SLALOM_BUOYS[this.getSlalomBuoysIndex()]);
		},

		updateIndividualSlalomResult: function () {
			return this.setIndividualSlalomResult(this.getIndividualSlalomTrackIndex() * 6 + window.SLALOM_BUOYS[this.getIndividualSlalomBuoysIndex()]);
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
			this.set({slalomResult: slalomResult}, {validate: true});
			if (this.getSlalomResult() > this.getIndividualSlalomResult()) {
				this.setIndividualSlalomBuoysIndex(this.getSlalomBuoysIndex());
				this.setIndividualSlalomTrackIndex(this.getSlalomTrackIndex());
			}
			return this;
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
			this.set({tricksResult: tricksResult}, {validate: true});
			if (this.getTricksResult() > this.getIndividualTricksResult()) {
				this.setIndividualTricksResult(this.getTricksResult());
			}
			return this;
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
			this.set({jumpResult: jumpResult}, {validate: true});
			if (this.getJumpResult() > this.getIndividualJumpResult()) {
				this.setIndividualJumpResult(this.getJumpResult());
			}
			return this;
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
		},

		setIndividualSlalomTrackIndex: function (individualSlalomTrackIndex) {
			this.set({individualSlalomTrackIndex: individualSlalomTrackIndex}, {validate: true});
			this.updateIndividualSlalomResult();
			return this;
		},

		getIndividualSlalomTrackIndex: function () {
			return this.get('individualSlalomTrackIndex');
		},

		setIndividualSlalomBuoysIndex: function (individualSlalomBuoysIndex) {
			this.set({individualSlalomBuoysIndex: individualSlalomBuoysIndex}, {validate: true});
			this.updateIndividualSlalomResult();
			return this;
		},

		getIndividualSlalomBuoysIndex: function () {
			return this.get('individualSlalomBuoysIndex');
		},

		setIndividualSlalomResult: function (individualSlalomResult) {
			return this.set({individualSlalomResult: individualSlalomResult}, {validate: true});
		},

		getIndividualSlalomResult: function () {
			return this.get('individualSlalomResult');
		},

		setIndividualSlalomScore: function (individualSlalomScore) {
			return this.set({individualSlalomScore: individualSlalomScore}, {validate: true});
		},

		getIndividualSlalomScore: function () {
			return this.get('individualSlalomScore');
		},

		setIndividualTricksResult: function (individualTricksResult) {
			return this.set({individualTricksResult: individualTricksResult}, {validate: true});
		},

		getIndividualTricksResult: function () {
			return this.get('individualTricksResult');
		},

		setIndividualTricksScore: function (individualTricksScore) {
			return this.set({individualTricksScore: individualTricksScore}, {validate: true});
		},

		getIndividualTricksScore: function () {
			return this.get('individualTricksScore');
		},

		setIndividualJumpResult: function (individualJumpResult) {
			return this.set({individualJumpResult: individualJumpResult}, {validate: true});
		},

		getIndividualJumpResult: function () {
			return this.get('individualJumpResult');
		},

		setIndividualJumpScore: function (individualJumpScore) {
			return this.set({individualJumpScore: individualJumpScore}, {validate: true});
		},

		getIndividualJumpScore: function () {
			return this.get('individualJumpScore');
		},

		setIndividualOverallScore: function (individualOverallScore) {
			return this.set({individualOverallScore: individualOverallScore}, {validate: true});
		},

		getIndividualOverallScore: function () {
			return this.get('individualOverallScore');
		}

	});
});