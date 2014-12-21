$(function () {

	App.View.Team = Backbone.View.extend({
		initialize: function () {
			this.playerCollectionView = new App.View.PlayerCollection({collection: this.model.getPlayers()});
			this.listenTo(this.model, 'change', _.bind(this.render, this));
			this.listenTo(this.model.getPlayers(), 'change', _.bind(this.render, this));
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
			this.undelegateEvents();
			this.stopListening();
			this.playerCollectionView.remove();
			this.$el.empty();
			this.unbind();
			return this;
		},

		events: {
			'change .js-team-name': 'editName',
			'change .js-team-color': 'editColor',
			'click .js-team-delete-button': 'dispose'
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

		dispose: function (e) {
			e.preventDefault();
			this.model.dispose({success: _.bind(function(model, response) {
				this.remove();
				console.log('Команда удалена');
			}, this), error: function() {
				console.log('Команда не удалена');
			}});
		}
	});
});