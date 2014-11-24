$(function () {
	window.App = {
		Models: {},
		Collections: {},
		Views: {},
		Router: {}
	};
	
	window.template = function (id) {
		return _.template( $('#' + id).html() );
	};
	var vent = _.extend({}, Backbone.Events);

	App.Views.SpecialTasks = Backbone.View.extend({
		initialize: function () {
			vent.on('specialTasks:show', this.show, this);
		},

		show: function (id) {
			console.log('showing task with id: ' + id);
		}

	})
	new App.Views.SpecialTasks();

	App.Router = Backbone.Router.extend({
		routes: {
			''					: 'index',
			'specialTasks/:id'	: 'showSpecialTasks',
			'specialTasks/:id/'	: 'showSpecialTasks'

		},

		index: function () {
			console.log('index route');
		},

		showSpecialTasks: function (id) {
			vent.trigger('specialTasks:show', id);
		}
	});
	new App.Router();
	Backbone.history.start();

	App.Models.Team = Backbone.Model.extend({
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

	App.Views.Team = Backbone.View.extend({
		initialize: function () {
			this.model.on('change', this.render, this)
			this.model.on('destroy', this.remove, this)
		},

		tagName: 'li',
		
		template: template('teamTemplate'),

		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		},

		remove: function () {
			this.$el.remove();
			return this;
		},

		events: {
			'change .teamName': 'editTeam',
			'click .deleteTeam': 'destroy'
		},

		editTeam: function () {
			var newName = $(this.el).find('.teamName').val();
			this.model.setName(newName);
			this.render();
		},

		destroy: function () {
			this.model.destroy();
		}
	});
	App.Collections.Team = Backbone.Collection.extend({
		model: App.Models.Team
	});
	App.Views.Teams = Backbone.View.extend({
		tagName: 'ul',

		initialize: function () {
			this.collection.on('add', this.addOne, this);
		},

		render: function () {
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function (team) {
			var teamView = new App.Views.Team({model: team});
			this.$el.append(teamView.render().el);
		}
	});

	App.Views.AddTeam = Backbone.View.extend({
		el: '#addTeam',

		initialize: function() {
		},

		events: {
			'submit': 'submit'
		},

		submit: function (e) {
			e.preventDefault();

			var newTeamName = $(e.currentTarget).find('input[type=text]').val();
			var newTeam = new App.Models.Team({name: newTeamName}, {validate: true});
			this.collection.add(newTeam, {validate: true});

			console.log('Команда "' + newTeamName + '" добавлена');
			console.log(newTeam);
		}
	})


	// TODO 
	window.teams = new App.Collections.Team([
		{
			name: 'Украина'
		}, 
		{
			name: 'Франция'
		}, 
		{
			name: 'Швейцария'
		}, 
		{
			name: ''
		}
	], {validate: true});

	var teamsView = new App.Views.Teams({collection: teams});
	$('.teams').html(teamsView.render().el);

	var addTeamView = new App.Views.AddTeam({collection: teams});
	
	window.onbeforeunload = function() {
        return "Вы уверены, что хотите покинуть страницу? Все текущие данные будут потеряны!";
    }
});