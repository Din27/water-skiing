$(function () {
	App.Model.Team = Backbone.Model.extend({
		defaults: {
			name: ''
		},

		initialize: function () {
			// valid case
			this.on("change:name", function (){
	            console.log('Name changed to "' + this.getName() + '"');
	        }); 

			// invalid case
	        this.on("invalid", function (model, error) {
	            console.log('Validation error: ' + error);
	        });
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Teaem name should not be empty'; 
			}
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});	
		},

		getName: function () {
            return this.get('name');
        }
	});
});