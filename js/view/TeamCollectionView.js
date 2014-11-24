$(function () {
	App.View.TeamCollection = Backbone.View.extend({
		tagName: 'ul',

		initialize: function () {
			this.collection.on('add', this.addOne, this);
		},

		render: function () {
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function (team) {
			var teamView = new App.View.Team({model: team});
			this.$el.append(teamView.render().el);
		}
	});
});
