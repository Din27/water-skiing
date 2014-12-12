$(function () {
	App.View.PlayerCollection = Backbone.View.extend({
		tagName: 'ul',

		initialize: function () {
			this.collection.on('add', this.addOne, this);
		},

		render: function () {
			this.$el.html('');
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (player) {
			var playerView = new App.View.Player({model: player});
			this.$el.append(playerView.render().el);
		}
	});
});
