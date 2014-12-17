$(function () {
	App.View.Team = Backbone.View.extend({
		initialize: function () {
			this.playerCollectionView = new App.View.PlayerCollection({collection: this.model.getPlayers()});
			this.model.on('change', this.render, this);
			this.model.getPlayers().on('change', this.render, this);
			this.model.on('playersReset', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		tagName: 'li',
		
		template: template('teamTemplate'),

		_selectors: {
			teamTable: '.js-team',
			teamName: '.js-team-name',
			teamColor: '.js-team-color'
		},

		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			this.$el.find(this._selectors.teamTable).append(this.playerCollectionView.render().el);
			return this;
		},

		remove: function () {
			this.$el.remove();
			return this;
		},

		events: {
			'change .js-team-name': 'editName',
			'change .js-team-color': 'editColor',
			'click .js-team-delete-button': 'destroy'
		},

		editName: function () {
			var newName = $(this.el).find(this._selectors.teamName).val();
			this.model.setName(newName);
			// we need an explicit rendering here because if validation does not pass, than model will not be changed, a render will not be run
			this.render();
		},

		editColor: function () {
			var newColorIndex = $(this.el).find(this._selectors.teamColor).val();
			this.model.setColorIndex(newColorIndex);
			this.render();
		},

		destroy: function () {
			this.model.destroy();
		}
	});
});