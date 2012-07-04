
$(function() {
    // Helper function to get a URL from a Model or Collection as a property
    // or as a function.


    //Todo model
    var Todo = Backbone.Model.extend({

        defaults: {
            content: "empty ...",
            done: false,
            order: 0
        },

        initialize: function() {

            if(!this.get("content")){
                this.set({"content":  this.defaults.content});
            }
        },

        toggle: function() {
            this.save({"done": !this.get("done")});
        }



    });


    var TodoList = Backbone.Collection.extend({
        model: Todo,

        // tastypie uri
        url: "/api/todo/",

        comparator: function(todo) {
          return todo.get("order");
        },

        getDoneList: function(){
            return this.filter(
                function(todo){ return todo.get("done");}
            );
        },

        getRemainList: function() {
            return this.without.apply(this, this.getDoneList());
        },

        getNextOrder: function(){
            if(!this.length){
                return 1;
            } else {
                return this.last().get("order") + 1;
            }
        }
    });

    var todoList = new TodoList;

    var TodoView = Backbone.View.extend({
        tagName: "li",

        template: _.template($("#item-template").html()),

        initialize: function() {

            _.bindAll(this, "render", "remove", "edit", "updateOnEnter");

            // re-render when change
            this.model.bind("change", this.render);

            // destroy from storage, remove from view
            this.model.bind("destroy", this.remove);

            this.input = this.$('.item-edit input');
        },

        render: function(){
            $(this.el).html(this.template(this.model.toJSON()));

            // refer to correct $('.todo-input') in this element
            this.input = this.$('.item-edit input');

            // convenient way for other function to get this element
            return this;
        },

        edit: function() {
            $(this.el).addClass("editing");
            this.input.focus();
        },

        close: function () {
            this.model.save({"content":this.input.val()});
            $(this.el).removeClass("editing");
        },

        updateOnEnter: function(event) {
            if(event.keyCode != 13 ) return;
            this.close();
        },



        toggleCheck: function(){
            this.model.toggle(); // from Todo model
        },

        clear: function(){
            this.model.destroy();
        },


        events: {
            "click .check": "toggleCheck",
            "click .todo-destroy a": "clear",
            "dblclick .todo-content": "edit",
            "keypress .item-edit input": "updateOnEnter",
            "blur .item-edit input": "close"
        }
    });


    var AppView = Backbone.View.extend({

        el: $("#todo-app"),

//        statusTemplate: _.template($("#status-template").html()),

        events: {
            "keypress #create-todo-input": "createOnEnter",
            "keyup #create-todo-input": "triggerTooltip",
            "click #check-all": "toggleAllComplete",
            "click .clear-done a": "clearCompletedItems"
        },

        // if unbind, those callback functions or event triggered functions will lose the correct
        // value of 'this' reference.
        initialize: function(){
            _.bindAll(this, "createOnEnter", "addOne", "addAll","triggerTooltip",  "showTooltip", "render");

            // local variables
            this.input = this.$("#create-todo-input");
            this.statusTemplate = _.template($("#status-template").html());
            this.allCompleteCheck = this.$("#check-all")[0];
            this.clearDone = this.$(".clear-done");
            // bindings
            todoList.bind("add", this.addOne);
            todoList.bind("reset", this.addAll);
            todoList.bind('all', this.render);


            var  result = todoList.fetch();
        },

        render: function() {
            var remainList = todoList.getRemainList();
            var doneList = todoList.getDoneList();
            this.$("#todo-status").html(this.statusTemplate(
                {
                    total: todoList.length,
                    remain: remainList.length,
                    done: doneList.length
                }
            ));

            // check this checkbox when all items have been checked
            this.allCompleteCheck.checked = !remainList.length;
        },

        createOnEnter: function(event){
            if(event.keyCode != 13 || !this.input.val()) return;
            todoList.create({
                content: this.input.val(),
                done: false,
                order: todoList.getNextOrder()
            });
            this.input.val("");
        },

        // add to view
        addOne: function(todo) {
            var todoView = new TodoView({model: todo});
            this.$("#todo-list").append(todoView.render().el);
        },

        //add all to view
        addAll: function() {
            todoList.each(this.addOne);
        },

        showTooltip: function() {
            this.$(".ui-tooltip-top").show().fadeIn();
        },

        toggleAllComplete: function() {
            var isDone = this.allCompleteCheck.checked;
            todoList.each(function(todo) {
                todo.save({"done": isDone});
            });
        },

        clearCompletedItems: function(){
            // you can not do this because you are modifying the list you are iterating on
            // todoList.each(function(todo) { todo.destroy(); });

            _.each(todoList.getDoneList(), function(todo) { todo.destroy(); });
        },

        triggerTooltip: function(event) {
            var tooltip = this.$(".ui-tooltip-top");
            var inputValue = this.input.val();
            tooltip.fadeOut();
            if (this.tooltipTimeout) {
                clearTimeout(this.tooltipTimeout);
            }

            // do nothing if nothing happen
            if (inputValue == "" || inputValue == this.input.attr("placeholder")) return;

            var show = function(){ tooltip.show().fadeIn(); };
            // show after input char 1 second
            this.tooltipTimeout = _.delay(this.showTooltip, 1000);
        }
    });

    // start this app
    var appView = new AppView();

});


