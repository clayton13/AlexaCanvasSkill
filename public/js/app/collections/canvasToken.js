/*global define */
define([
    'underscore',
    'backbone',
    // 'backboneLocalstorage',
    'models/canvasToken'
], function(_, Backbone, canvasToken) {
    'use strict';

    var CanvasTokenCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: canvasToken,
    });

    return new CanvasTokenCollection;
});
