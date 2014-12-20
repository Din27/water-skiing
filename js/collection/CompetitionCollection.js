$(function () {
    App.Collection.Competition = Backbone.Collection.extend({
        model: App.Model.Competition,
        localStorage: new Backbone.LocalStorage("water-skiing-competitions")
    });
});