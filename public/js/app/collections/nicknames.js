/*global define */
define([
    'underscore',
    'backbone',
    // 'backboneLocalstorage',
    'models/nickname'
], function(_, Backbone, Nickname) {
    'use strict';

    var NicknamesCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Nickname,

        // Save all of the todo items under this example's namespace.
        // localStorage: new Store('nickname-backbone'),

        initialize: function() {
            this.listenTo(this, 'next', this.next);
            this.selected = false;
            // this.on("change", this.updateAttributes, this);
        },
        next: function(f) {
            // console.log(f)
        },

        // Filter down the list of all todo items that are finished.
        completed: function() {

            var x = this.filter(function(model) {
                // console.log(model)
                return model.selected == true;
            });
            // console.log(x)
            return x;
            // console.log(this)
            // return this.where({
            //     nickname: "completed"
            // });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.where({
                nickname: "remaining"
            });
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            return this.length ? this.last().get('order') + 1 : 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'
    });

    return NicknamesCollection;
});
