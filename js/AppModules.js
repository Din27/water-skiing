$(function () {
	window.App = {
		Model: {},
		Collection: {},
		View: {},
		Router: {}
	};
	
	window.template = function (id) {
		return _.template( $('#' + id).html() );
	};
});