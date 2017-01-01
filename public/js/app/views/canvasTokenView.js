/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/canvasToken',
    'text!templates/canvasTokenView.html',
    'common'
], function($, _, Backbone, canvasTokenModel, canvasToken, Common) {
    'use strict';
    var canvasTokenView = Backbone.View.extend({
        el: '#tokenView',
        template: _.template(canvasToken),
        events: {
            'submit form': 'validate',
            'reset form': 'doReset',
            'keyup #canvasToken': 'onType'

        },
        initialize: function() {
            // _.bindAll(this, 'this.render', 'this.remove', 'this.onRequest');

            this.once(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'request', this.onRequest, this);

            // this.render()

        },
        // Re-render the titles of the todo item.
        render: function(event) {
            console.log(this.model.toJSON())
            this.model.toJSON().access_token = this.model.toJSON().access_token.replace("*", "•`")

            var html = this.template(this.model.toJSON())
            this.$el.html(html);


            this.$input = this.$('#canvasToken');
            this.$invalidWarning = this.$('.text-warning');
            this.$validWarning = this.$(".text-success")
            this.$validCover = this.$('.alert');

            this.checkValid(true);

            return this;
        },
        onRequest: function(model, xhr, options) {
            var _this = this

            xhr.always(function(e) {
                switch (xhr.status) {
                    case 200:
                        console.log("render")
                        _this.render()
                        break;

                    case 499:
                        _this.doInvalid();
                        break;

                    default:
                        //TODO Display global message
                        var repsonse = xhr.responseText;
                        break;
                }
            })
        },
        doInvalid: function() {
            console.log("do invalid")
            this.$invalidWarning.show()
            this.$validCover.hide()
        },
        doValid: function() {
            this.$invalidWarning.hide()
            this.$validCover.show()
            this.trigger("tokenUpdate")
        },

        checkValid: function(initial) {
            if (this.model.get('valid') === true) {
                this.doValid();
                if (initial) {
                    this.$validWarning.show()
                }
            } else {
                this.doInvalid();
            }
        },
        onType: function() {
            this.model.set("valid", false)
            this.$validWarning.hide()
        },
        validate: function(e) {
            e.preventDefault();
            this.model.set("access_token", this.$input.val())

            //If token actually changed
            if (this.model.changedAttributes()) {
                this.model.save();
            } else {
                console.log("no changes")
                this.model.set("valid", true)
                this.render()

            }
        },
        doReset: function() {
            this.model.fetch()
        },
        clear: function() {
            this.model.destroy();
        }
    });

    return canvasTokenView;
});
