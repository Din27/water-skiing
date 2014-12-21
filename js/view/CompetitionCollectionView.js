$(function () {
	App.View.CompetitionCollection = Backbone.View.extend({
		tagName: 'div',

		el: 'body',

		template: template('competitionsTemplate'),

		events: {
			'click .competition-tab-link': 'changeTab'
		},

		initialize: function () {},

		render: function () {
			var wrapper = {};
			wrapper.data = this.collection.toJSON()
			var template = this.template(wrapper);
			this.$el.html(template);
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (competition) {
			var competitionView = new App.View.Competition({model: competition});
			var tabContentSelector = '#competition-tab-' + competition.getTabName();
			this.$el.find(tabContentSelector).append(competitionView.render().el);
		},

		changeTab: function (e) {
			e.preventDefault();
			$(e.target).tab('show');
		}
	});
});
