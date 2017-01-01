/*global define*/
define([
    'underscore',
    'backbone',
    "backbone_relational"
], function(_, Backbone) {
    'use strict';

    var Nickname = Backbone.RelationalModel.extend({
        // Default attributes for the todo
        // and ensure that each todo created has `title` and `completed` keys.
        defaults: {
            nickname: "unset"
        },
        initialize: function() {
            console.log("hello")
            this.selected = false;
            // this.on("change", this.updateAttributes, this);
        },
        url: "/api/courses/",
        // sync: function(method, model, options) {
        //     console.log("sync")
        // },
        // Toggle the `completed` state of this todo item.
        toggle: function() {
            this.save({
                nickname: "----" + this.get('completed')
            });
        },
        isSelected: function() {
            return this.selected;
        }

    });

    return Nickname;
});
