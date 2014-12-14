$(function () {
	App.View.Player = Backbone.View.extend({

		tagName: 'tr',

		template: template('playerTemplate'),

		_selectors: {
			name: '.js-player-name',
			gender: '.js-player-gender'
		},

		events: function () {
			var _events = {};
			_events['change ' + this._selectors.name] = 'editName';
			_events['change ' + this._selectors.gender] = 'editGender';
			return _events;
		},

		initialize: function () {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		},

		remove: function () {
			this.$el.remove();
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

		destroy: function () {
			this.model.destroy();
		}
	});
});