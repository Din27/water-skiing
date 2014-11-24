$(function () {
	App.Model.Team = Backbone.Model.extend({
		defaults: {
			name: ''
		},

		initialize: function () {
			// valid case
			this.on("change:name", function (){
	            console.log('Имя команды изменено на "' + this.getName() + '"');
	        }); 

			// invalid case
	        this.on("invalid", function (model, error) {
	            console.log('Ошибка валидации: ' + error);
	        });
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя команды не должно быть пустым'; 
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