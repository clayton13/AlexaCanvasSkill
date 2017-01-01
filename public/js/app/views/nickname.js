/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/nickname.html',
    'common'
], function($, _, Backbone, todosTemplate, Common) {
    'use strict';

    var NicknameView = Backbone.View.extend({

        //tagName:  '',

        template: _.template(todosTemplate),

        // The DOM events specific to an item.
        events: {
            'click ': 'isSelected',
            'dblclick .nickname': 'openEditor',
            'mousedown .glyphicon-remove': 'handleRemoveClick',
            'mouseup .glyphicon-remove': 'handleRemoveClick',

            'keypress .inlineinput': 'updateOnEnter',
            'keydown .inlineinput': 'revertOnEscape',
            'blur .inlineinput': 'closeEditor'
        },
        handleRemoveClick: function(event) {
            if (event.type == "mousedown") {
                this.flag = false;
            } else if (event.type == "mouseup") {
                this.flag = true;
                this.removeNickname()
                console.log("remove me!!!")
            }
        },
        removeNickname: function(btnNickname) {
            this.$btnNickname.hide();
        },
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            // this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
            this.listenTo(this.model, 'open', this.openEditor);
            this.listenTo(this.model, 'close', this.closeEditor);

        },

        // Re-render the titles of the todo item.
        render: function() {
            console.log("nickname")
            console.log(this.model)
            var html = this.template(this.model.toJSON())
                // this.$el.html();
                // this.$el.toggleClass('completed', this.model.get('completed'));
            this.setElement(html);
            //this.$el.html(html);
            // this.toggleVisible();

            this.flag = true;
            this.$btnNickname = $(this.el);
            this.$input = this.$('.inlineinput');
            this.$nickname = this.$('span.nickname');
            this.$popbox = this.$nickname.siblings(".popbox");


            return this;
        },

        toggleVisible: function() {
            var input = $(".inlineinput").parent().hide()
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function() {
            var isCompleted = this.model.get('completed');
            return ( // hidden cases only
                (!isCompleted && Common.TodoFilter === 'completed') ||
                (isCompleted && Common.TodoFilter === 'active')
            );
        },
        isSelected: function(event) {
            if (event) {
                //If from event handler
                //Wait 100ms before updating, bootstrap callback for buttons is after this callback
                _.delay(this.isSelected.bind(this), 100)
            } else {
                var selected = this.$btnNickname.hasClass("active");
                this.model.selected = selected;
                return selected;
            }
        },
        getNickname: function() {
            return this.model.get('nickname');
        },
        setNickname: function(nickname) {
            var trimmedValue = nickname.trim();

            if (trimmedValue) {
                console.log("update")
                this.model.set({
                    nickname: trimmedValue
                });

                if (nickname !== trimmedValue) {
                    // Model values changes consisting of whitespaces only are not causing change to be triggered
                    // Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
                    // And if yes, we've to trigger change event ourselves
                    this.model.trigger('change');
                }
            } else {
                this.clear();
            }

            this.$nickname.text(nickname);
        },

        // Open the editor for nickname
        openEditor: function(event) {
            // console.log("AsdfadsF")
            // event.stopPropagation()

            var orig = this.$nickname
            var popbox = this.$popbox
            var input = this.$input

            var strNickName = this.getNickname();
            input.val(strNickName)

            popbox.show();
            orig.hide()
            input.select();
            input.focus();
        },
        closeEditor: function(event) {
            if (this.flag) {
                var input = this.$input
                var orig = this.$nickname
                var popbox = this.$popbox

                // var orig = input.parent().siblings("span.nickname")
                // console.log(input.val())
                var iNickName = input.val();
                popbox.hide();

                this.setNickname(iNickName)
                orig.show();

                this.$el.removeClass('editing');
            }
            if (!this.$input.val() && this.flag) {
                //empty
                console.log($("header"))
            }
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
            this.$el.addClass('editing');
            this.$input.focus();
        },
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
            var key = e.keyCode || e.which;

            // console.log(key)

            if (key === Common.ENTER_KEY) {
                this.closeEditor();
                // this.close();
            } else if (key === Common.TAB_KEY) {
                e.preventDefault();
                console.log("next trigger")
                this.model.trigger('next', this);
            }
        },

        // If you're pressing `escape` we revert your change by simply leaving
        // the `editing` state.
        revertOnEscape: function(e) {
            console.log(e.which)
            console.log(Common.TAB_KEY)

            if (e.which === Common.ESCAPE_KEY) {
                this.$el.removeClass('editing');
                // Also reset the hidden input back to the original value.

                this.$input.val(this.model.get('nickname'));
                this.$input.blur()
                    // this.closeEditor()
            } else if (e.which === Common.TAB_KEY) {
                e.preventDefault();
                console.log("next trigger")
                this.model.trigger('next',  this.model );
            }
        },

        // Remove the item, destroy the model from *localStorage* and delete its view.
        clear: function() {
            this.model.destroy();
        }
    });

    return NicknameView;
});
