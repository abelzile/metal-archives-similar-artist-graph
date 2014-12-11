define(["jquery",
        "underscore",
        "backbone",
        "text!templ/search-result.html"],
    function ($,
              _,
              Backbone,
              Template) {

        "use strict";

        return Backbone.View.extend({

            tagName: 'tr',

            template: _.template(Template),

            events: {

                "click .search-link": function() {

                    this.trigger('search-result:select', this.model);

                }

            },

            render: function() {

                this.$el.html(this.template(this.model.toJSON()));

                return this;

            }

        });

    }
);