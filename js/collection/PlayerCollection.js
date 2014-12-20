$(function () {
	App.Collection.Player = Backbone.Collection.extend({
		model: App.Model.Player,

		dispose: function() {
			var player;
			while (player = this.first()) {
				player.dispose();
			}
			this.off();
		}
	});
});