$(function() {
	App.View.TopPlayer = Backbone.View.extend({
		template: template('topPlayerTemplate'),

		tagName: 'tr',

		_selectors: {
			individualSlalomBuoys: '.js-player-individual-slalom-buoys',
			individualSlalomTrack: '.js-player-individual-slalom-track',
			individualTricksResult: '.js-player-individual-tricks-result',
			individualJumpResult: '.js-player-individual-jump-result'
		},

		events: function () {
			var _events = {};
			_events['change ' + this._selectors.individualSlalomBuoys] = 'editIndividualSlalomBuoys';
			_events['change ' + this._selectors.individualSlalomTrack] = 'editIndividualSlalomTrack';
			_events['change ' + this._selectors.individualTricksResult] = 'editIndividualTricksResult';
			_events['change ' + this._selectors.individualJumpResult] = 'editIndividualJumpResult';
			return _events;
		},
		initialize: function(options) {
			_.extend(this, _.pick(options, "slalomMenTracks", "slalomWomenTracks"));
		},

		render: function() {
			var template = this.template(_.extend(this.model.toJSON(), {slalomMenTracks: this.slalomMenTracks, slalomWomenTracks: this.slalomWomenTracks}));
			this.$el.html(template);
			this.$el.css('background-color', window.TEAM_COLORS[this.model.getColorIndex()].color);
			return this;
		},


		editIndividualSlalomBuoys: function () {
			var individualSlalomBuoysIndex = +$(this.el).find(this._selectors.individualSlalomBuoys).val();
			this.model.setIndividualSlalomBuoysIndex(individualSlalomBuoysIndex);
			this.render();
		},

		editIndividualSlalomTrack: function () {
			var individualSlalomTrackIndex = +$(this.el).find(this._selectors.individualSlalomTrack).val();
			this.model.setIndividualSlalomTrackIndex(individualSlalomTrackIndex);
			this.render();
		},

		editIndividualTricksResult: function () {
			var individualTricksResult = +$(this.el).find(this._selectors.individualTricksResult).val();
			this.model.setIndividualTricksResult(individualTricksResult);
			this.render();
		},

		editIndividualJumpResult: function () {
			var individualJumpResult = +$(this.el).find(this._selectors.individualJumpResult).val();
			this.model.setIndividualJumpResult(individualJumpResult);
			this.render();
		},

		remove: function () {
			this.undelegateEvents();
			this.stopListening();
			this.$el.empty();
			this.unbind();
			return this;
		}
	})
});