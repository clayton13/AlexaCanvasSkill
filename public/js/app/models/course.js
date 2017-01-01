/*global define*/
define([
    'underscore',
    'backbone',
    'models/nickname',
    'collections/nicknames',

    "backbone_relational"
], function(_, Backbone, Nickname, Nicknames) {
    'use strict';

    var Course = Backbone.RelationalModel.extend({
        // Default attributes for the todo
        // and ensure that each todo created has `title` and `completed` keys.
        // defaults: {
        //     name: "unset"
        // },
        // urlRoot: '/api/courses',
        idAttribute: 'id',
        relations: [{
            type: Backbone.HasMany,
            key: 'nicknames',
            keySource: 'nicknames',
            autoFetch: true,
            relatedModel: Nickname,
            collectionType: Nicknames,
            // reverseRelation: {
            //     key: 'thread',
            //     includeInJSON: '_id',
            // },
        }],
        initialize: function() {
            console.log(this.attributes.nicknames)
        },
    });

    return Course;
});
