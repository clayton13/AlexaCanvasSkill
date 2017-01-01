/*global define */
define([
    'underscore',
    'backbone',
    // 'backboneLocalstorage',
    'models/course'
], function(_, Backbone, Course) {
    'use strict';

    var CoursesCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Course,
        url: '/api/courses',
        // comparator: 'order'
        initialize: function() {
            this.listenTo(this, 'request', this.onRequest);
            this.selected = false;
            // this.on("change", this.updateAttributes, this);
        },
        onRequest: function(model, xhr, options) {
            var _this = this
            xhr.always(function(e) {
                console.log(xhr)
                console.log(_this)

                console.log(xhr.status)
                switch (xhr.status) {


                    case 490:
                        console.log("requested")
                        console.log(_this.models)
                        console.log(_this.length)
                        break;

                    default:
                        //TODO Display global message
                        var repsonse = xhr.responseText;
                        break;
                }
            })
        },
        getChanged: function() {
            // return a list of models that have changed by checking hasChanged()
        },
        getLength: function() {
            return this.length
            console.log(this.length)
        },
        save: function(attributes, options) {
            // (this).each(function(todo) {
            //     if (todo.id = 4321) {
            //         todo.save();
            //         console.log(todo)

            //     }
            // });
            console.log("collection")
        }
    });

    return new CoursesCollection();
});
