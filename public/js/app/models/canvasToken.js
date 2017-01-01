/*global define*/
define([
    'underscore',
    'backbone',
    'jquery',
    "backbone_relational"
], function(_, Backbone, $) {
    'use strict';

    var canvasAccessToken = Backbone.Model.extend({
        defaults: {
            name: "",
            account: {
                // primary_email: "",

            },
            access_token: "",
            valid: false
        },
        urlRoot: "/api/canvas",
        url: function() {
            return '/api/canvas';
        },
        initialize: function() {
            this.id = 1;
        }
    });

    return canvasAccessToken;
});
