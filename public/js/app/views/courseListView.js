/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/courses',
    'views/course',
    'text!templates/courseNicknamesView.html',
    'common'
], function($, _, Backbone, Courses, CourseView, courseNickname, Common) {
    'use strict';

    var AppView = Backbone.View.extend({
        el: '#courseNicknames',
        // tagName: 'div',

        // className: 'thread_list_view',
        template: _.template(courseNickname),

        initialize: function() {

            this.collection = Courses
            Courses.fetch();
            // this.collection

            _.bindAll(this, 'render', 'renderNicknames', "courseReset");
            this.collection.bind('reset', this.courseReset);
            this.collection.bind('change', this.courseReset);
            this.collection.bind('add', this.renderNicknames);
            this.listenTo(this.collection, 'request', this.onRequest);


            this.render()
        },
        onRequest: function(model, xhr, options) {
            var _this = this

            xhr.always(function(e) {
                console.log(e.length)


                switch (xhr.status) {
                    case 200:
                        console.log("render")
                        _this.render()
                        break;

                    case 499:
                        _this.doInvalid();
                        break;

                    default:
                        $(this.el).hide()
                            //TODO Display global message

                        var repsonse = xhr.responseText;
                        break;
                }
            })
        },

        courseReset: function() {
            //Nothing really needs to happen here, the child views handle everything

            console.log("Reset");
            // console.log(this.fetch({
            //     reset: true
            // }))
            // console.log(this.model.toJSON())

        },
        render: function() {
            // $("#courseNicknames").html("adsfadsfadsf")
            $(this.el).html(this.template());

            // this.setElement(this.el);

            if (this.collection.length == 0) {
                $(this.el).hide()
            }else {
                $(this.el).show()   
            }

            this.$accordion = this.$('#accordion')
            this.collection.forEach(this.renderNicknames);

            return $(this.el).html();
        },

        renderNicknames: function(thread) {
            console.log("Course")
      if (this.collection.length == 0) {
                $(this.el).hide()
            }else {
                $(this.el).show()   
            }
            // this.model.models.attributes
            // console.log(this.model.models[0].attributes.nicknames.length)
            console.log("End Course")

            var thread_summary_view = new CourseView({
                model: thread
            });
            var html = thread_summary_view.render().el;
            console.log(html)
            this.$accordion.append(html)
        }
    });

    return AppView;
});
