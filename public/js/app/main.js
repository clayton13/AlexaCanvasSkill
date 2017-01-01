/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        },
        backbone_relational: {
            deps: ['backbone']
        },
        bootstrap: {
            deps: ['jquery'],
            // exports: "jQuery.fn.popover"

        },
    },
    paths: {
        jquery: '../../../node_modules/jquery/dist/jquery',
        underscore: '../../../node_modules/underscore/underscore',
        backbone: '../../../node_modules/backbone/backbone',
        backbone_relational: '../../../node_modules/backbone-relational/backbone-relational',
        // backboneLocalstorage: '../../../node_modules/backbone.localstorage/backbone.localStorage',
        text: '../../../node_modules/requirejs-text/text',
        bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min'
    }
});

require(['bootstrap'], function() {

    $('[data-toggle="tooltip"]').tooltip({
        'delay': {
            show: 750,
            hide: 100
        }
    });
    var input = $(".inlineinput").parent().hide()

    $('body').on('load', 'input[type="checkbox"]', function() {
        $(this).checkboxes(); // checkboxes on matched element
    });
});

require([
    'backbone',
    'views/courseListView',
    'views/canvasTokenView',
    'collections/canvasToken',
    'models/canvasToken',

    'routers/mrouter'
], function(Backbone, courseListView, canvasTokenView, canvasTokenCollection, canvasToken, Workspace) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    // new Workspace();
    // Backbone.history.start();


    // Initialize the application view
    // new AppView();

    // var collection = new canvasToken();
    // var thread_list_view = new canvasTokenView({
    //     el: '#tokenView',
    //     // el: $('#todoapp'),
    //     model: collection
    // });
    // collection.fetch();
    var m = new canvasToken({
        id: 1
    })

    var tokenView = new canvasTokenView({
        model: m
    });
    m.fetch()

    var courseNicknames = new courseListView();

    var myVal = _.extend({
        name: 'Hello..'
    }, Backbone.Events);
    myVal.listenTo(tokenView, "tokenUpdate", function() {
        console.log("update global")
        courseNicknames.collection.fetch();

    })
});

// .mixin({
//     idle: function(code, delay) {
//         var handle;
//         return function() {
//             if (handle) {
//                 window.clearTimeout(handle);
//             }
//             handle = window.setTimeout(_.bind(code, this), delay);
//         }
//     }
// });
