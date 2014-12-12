$(function () {
	App.Model.Player = Backbone.Model.extend({
		defaults: {
			name: '',
			gender: ''

		},

		initialize: function () {
	        this.on("invalid", function (model, error) {
	            console.log('Ошибка валидации: ' + error);
	        });
		},

		toJSON: function() {
			return _.pick(this.attributes, 'name', 'gender');
		},

		validate: function (attrs) {
			if (!$.trim(attrs.name)) {
				return 'Имя спортсмена не должно быть пустым';
			}
			if (attrs.gender !== "M" && attrs.gender !== "F" ) {
				return 'Нужно выбрать пол спортсмену';
			}
		},

		setName: function (name) {
			return this.set({name: name}, {validate: true});
		},

		getName: function () {
			return this.get('name');
		},

		setGender: function (gender) {
			return this.set({gender: gender}, {validate: true});
		},

		getGender: function () {
			return this.get('gender');
		}

	});
});