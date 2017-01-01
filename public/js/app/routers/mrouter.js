/*global define*/
define([
    'jquery',
    'backbone',
    'views/courseListView',
    'collections/courses',
    'common'
], function($, Backbone, courseListView, Courses, Common) {
    'use strict';

    var NicknameRouter = Backbone.Router.extend({
        routes: {
            '': 'show'
        },

        show: function(param) {
            // var courseCollection = Courses;
            // var thread_list_view = new courseListView({
            //     collection: courseCollection
            // });
             // var thread_list_view = new courseListView();
            // courseCollection.fetch();

            // var thread = new $.forum.Thread({
            //     _id: _id
            // });
            // var thread_view = new $.forum.ThreadView({
            //     el: $('#content'),
            //     model: thread
            // });
            // thread.fetch();
        }
    });

    return NicknameRouter;
});
