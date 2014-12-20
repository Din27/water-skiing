$(function () {
	App.View.PlayerCollection = Backbone.View.extend({
		tagName: 'tbody',

		initialize: function () {
		},

		render: function () {
			this.$el.html('');
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (player) {
			var playerView = new App.View.Player({model: player});
			this.$el.append(playerView.render().el);
		},

		remove: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.unbind();
		}
	});
});
