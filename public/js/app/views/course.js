/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/nicknames',
    'views/nickname',
    'text!templates/course.html',
    'common'
], function($, _, Backbone, Nicknames, TodoView, statsTemplate, Common) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        // el: '#todoapp',
        tagName: 'div',
        // Compile our stats template
        template: _.template(statsTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            'keypress #new-todo': 'createOnEnter',
            'click #clear-completed': 'clearCompleted',
            'click #toggle-all': 'toggleAllComplete',
            'click .addNickname': 'addNickname',
            'click .removeNicknames': 'removeSelected',
            'click .doRefresh': 'doRefresh'
        },
        doRefresh: function(e) {
            e.preventDefault();
            e.stopPropagation()
            console.log(this.model.save())

        },
        saveStuff: function() {
            // this.model.collection.fetch({
            //     reset: true
            // })
            // .fetch({
            //     reset: true
            // }))
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {
            console.log(this.model)

            Nicknames = this.model.attributes.nicknames
                // this.setElement(this.el);
            this.Nicknames = this.model.attributes.nicknames

            // this.$nicknames = this.$(".courseNicknames")

            this.listenTo(this.Nicknames, 'add', this.addOne);
            this.listenTo(this.Nicknames, 'reset', this.addAll);
            this.listenTo(this.Nicknames, 'change', this.updated);
            this.listenTo(this.Nicknames, 'change:completed', this.filterOne);
            this.listenTo(this.Nicknames, 'filter', this.filterAll);
            this.listenTo(this.Nicknames, 'next', this.openNext);

            // this.listenTo(Todos, 'all', _.debounce(this.subrender, 0));
            //   _.bindAll(this, 'this.render', 'this.add', 'this.reset', 'this.next');
            // Todos.fetch({
            //     reset: true
            // });
            // this.render();
        },
        updated: function(el) {
            console.log("updated")
            console.log(this)
            this.addAll()
        },
        openNext: function(el) {
            console.log("-------")
            console.log(this.Nicknames)
            console.log(this.model.attributes.nicknames)
            var index = this.Nicknames.indexOf(el)
            if (index == this.Nicknames.models.length - 1) {
                el.trigger("close")
                this.addNickname()
            } else {
                el.trigger("close")

                this.Nicknames.models[index + 1].trigger("open")
            }
        },
        subrender: function(el) {
            console.log(el)
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {

            var html = this.template({
                courseName: this.model.attributes.name || this.model.attributes.nickname,
                id: this.model.cid
            });

            // this.$el.html(this.template({
            //     courseName: this.model.attributes.name,
            //     id: this.model.cid
            // }))
            this.setElement(html);

            console.log(this.$el.html)
                // this.setElement(html);

            console.log($(this.el).html())
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$viewCollection = [];
            this.$input = this.$('#new-todo');
            this.$footer = this.$('#footer');
            this.$main = this.$('#main');
            this.$todoList = this.$(".courseNicknames") //this.$('#todo-list');

            this.$main.show();
            this.$footer.show();

            this.$add = this.$(".addNickname");
            console.log("el")

            console.log(this.$add)

            this.$todoList = this.$(".courseNicknames")
            console.log(this.$todoList)
            var todoList = this.$todoList

            this.addAll();

            // console.log(html)
            // this.Nicknames.each(function(todo) {
            //     var view = new TodoView({
            //         model: todo
            //     });
            //     console.log("-----")
            //         //console.log(this.template)
            //     todoList.append(view.render().el);
            // });

            // } else {
            //  // /   this.$main.hide();
            //     // this.$footer.hide();
            // }
            // events.push({
            //         this.$add: "addNickname"
            //     })
            // this.$add.on("click", )

            return this; //$(this.el).html();
        },
        addNickname: function() {
            console.log(this)
            var view = this.Nicknames.create({
                nickname: ""
            })
            console.log(view)
            view.trigger("open");
        },
        removeSelected: function() {
            _.invoke(this.Nicknames.completed(), 'destroy');
            return false;
        },
        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(todo) {
            var view = new TodoView({
                model: todo
            });

            // console.log($(".courseNicknames"))
            // this.$nicknames.append(view.render().el);
            this.$todoList.append(view.render().el);
            this.$viewCollection.push(view)
        },

        // Add all items in the **Nicknames** collection at once.
        addAll: function() {
            this.$todoList.empty();
            this.Nicknames.each(this.addOne, this);
        },

        filterOne: function(todo) {
            todo.trigger('visible');
        },

        filterAll: function() {
            this.Nicknames.each(this.filterOne, this);
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function() {
            return {
                nickname: this.$input.val().trim()
                    // order: Nicknames.nextOrder(),
                    // completed: false
            };
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
            if (e.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
                return;
            }

            this.Nicknames.create(this.newAttributes());
            this.$input.val('');
        },

        // Clear all completed todo items, destroying their models.
        clearCompleted: function() {
            _.invoke(this.Nicknames.completed(), 'destroy');
            // _.without(this.$viewCollection, );
            return false;
        },

        toggleAllComplete: function() {
            var completed = this.allCheckbox.checked;

            this.Nicknames.each(function(todo) {
                todo.set({
                    completed: completed
                });
            });
        }
    });

    return AppView;
});
