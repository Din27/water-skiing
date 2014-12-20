$(function () {
	App.View.CompetitionCollection = Backbone.View.extend({
		tagName: 'div',

		el: 'body',

		initialize: function () {},

		render: function () {
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (competition) {
			var competitionView = new App.View.Competition({model: competition});
			this.$el.append(competitionView.render().el);
		}
	});
});
