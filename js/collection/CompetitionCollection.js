$(function () {
    App.Collection.Competition = Backbone.Collection.extend({
        model: App.Model.Competition,

        comparator: function(competition) {
            return competition.getTabName();
        },

        localStorage: new Backbone.LocalStorage('water-skiing-competitions')
    });
});