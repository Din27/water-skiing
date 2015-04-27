$(function () {
	App.View.Player = Backbone.View.extend({

		tagName: 'tr',

		template: template('playerTemplate'),

		_selectors: {
			name: '.js-player-name',
			gender: '.js-player-gender',
			slalomBuoys: '.js-player-slalom-buoys',
			slalomTrack: '.js-player-slalom-track',
			tricksResult: '.js-player-tricks-result',
			jumpResult: '.js-player-jump-result'
		},

		events: function () {
			var _events = {};
			_events['change ' + this._selectors.name] = 'editName';
			_events['change ' + this._selectors.gender] = 'editGender';
			_events['change ' + this._selectors.slalomBuoys] = 'editSlalomBuoys';
			_events['change ' + this._selectors.slalomTrack] = 'editSlalomTrack';
			_events['change ' + this._selectors.tricksResult] = 'editTricksResult';
			_events['change ' + this._selectors.jumpResult] = 'editJumpResult';
			return _events;
		},

		initialize: function (options) {
			_.extend(this, _.pick(options, "slalomMenTracks", "slalomWomenTracks"));
		},

		render: function () {
			var template = this.template(_.extend(this.model.toJSON(), {slalomMenTracks: this.slalomMenTracks, slalomWomenTracks: this.slalomWomenTracks}));
			this.$el.html(template);
			return this;
		},

		remove: function () {
			this.undelegateEvents();
			this.$el.empty();
			this.unbind();
			return this;
		},

		editName: function () {
			var newName = $(this.el).find(this._selectors.name).val();
			this.model.setName(newName);
			this.render();
		},

		editGender: function () {
			var playerGender = $(this.el).find(this._selectors.gender).val();
			this.model.setGender(playerGender);
			this.render();
		},

		editSlalomBuoys: function () {
			var slalomBuoysIndex = +$(this.el).find(this._selectors.slalomBuoys).val();
			this.model.setSlalomBuoysIndex(slalomBuoysIndex);
			this.render();
		},

		editSlalomTrack: function () {
			var slalomTrackIndex = +$(this.el).find(this._selectors.slalomTrack).val();
			this.model.setSlalomTrackIndex(slalomTrackIndex);
			this.render();
		},

		editTricksResult: function () {
			var tricksResult = +$(this.el).find(this._selectors.tricksResult).val();
			this.model.setTricksResult(tricksResult);
			this.render();
		},

		editJumpResult: function () {
			var jumpResult = +$(this.el).find(this._selectors.jumpResult).val();
			this.model.setJumpResult(jumpResult);
			this.render();
		},

		destroy: function () {
			this.model.destroy();
		}
	});
});