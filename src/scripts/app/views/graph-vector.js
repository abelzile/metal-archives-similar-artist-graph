define(["jquery",
        "underscore",
        "backbone",
        "text!templ/graph-vector.html",
        "app/utils/math-ext",
        "app/models/band",
        "app/collections/band-related-list",
        "app/collections/band-related-query",
        "app/utils/number-ext"],
    function ($,
              _,
              Backbone,
              Template,
              MathExt,
              Band,
              BandRelatedList,
              BandRelatedQuery,
              NumberExt
        ) {

        "use strict";

        return Backbone.View.extend({

            POSITION_OFFSET: -40,

            _childrenLoaded: false,

            template: _.template(Template),

            events: {

                "click .graph-vector-expand-related-wrapper > .toggle-link": "_showHideRelated",

                "click .graph-vector-expand-details-wrapper > .info-link": "_showBandInfo"

            },

            initialize: function(options) {

                Object.defineProperties(
                    this,
                    {
                        "x": {
                            get: function() { return this._x; },
                            set: function(val) {
                                this.prevX = this._x;
                                this._x = NumberExt.toInteger(val);
                            },
                            enumerable: true
                        },
                        "y": {
                            get: function() { return this._y; },
                            set: function(val) {
                                this.prevY = this._y;
                                this._y = NumberExt.toInteger(val);
                            },
                            enumerable: true
                        },
                        "prevX": {
                            get: function() { return this._prevX; },
                            set: function(val) { this._prevX = val; },
                            enumerable: true
                        },
                        "prevY": {
                            get: function() { return this._prevY; },
                            set: function(val) { this._prevY = val; },
                            enumerable: true
                        },
                        "hasMoved": {
                            get: function() {
                                return this.x !== this.prevX || this.y !== this.prevY;
                            },
                            enumerable: true
                        }
                    });

                _.extend(this, _.pick(options, "x", "y", "prevX", "prevY"));

                this.$el
                    .addClass("graph-vector")
                    .css({
                         left: (this.x + this.POSITION_OFFSET) + "px",
                         top: (this.y + this.POSITION_OFFSET) + "px"
                    });

            },

            render: function() {

                var data = this.model.toJSON();

                _.extend(data, {
                    toggleFontClass: (this._childrenLoaded) ? "fa-minus-circle" : "fa-plus-circle",
                    toggleDecoClass: (this._childrenLoaded) ? "toggle-link-glow-on" : "toggle-link-glow-off"
                });

                this.$el.html(this.template(data));

                return this;

            },

            remove: function() {

                this.$el.fadeOut("fast", _.bind(function() {
                    Backbone.View.prototype.remove.call(this);
                }, this));

                return this;

            },

            animate: function() {

                var dfd = $.Deferred();

                this.$el
                    .animate({
                        left: (this.x + this.POSITION_OFFSET) + "px",
                        top: (this.y + this.POSITION_OFFSET) + "px"
                    },
                    "fast",
                    "swing",
                    function() {
                        dfd.resolve();
                    });

                return dfd.promise();

            },

            _showHideRelated: function() {

                if (!this._childrenLoaded) {

                    this.trigger("graph-vector:showing-related");

                    this.model.get("relatedBands").fetch({

                        data: (new BandRelatedQuery(this.model.get("id"))).build(),

                        parentBand: this.model,

                        success: _.bind(function (collection, response, options) {

                            this._childrenLoaded = true;

                            this.trigger("graph-vector:showed-related");

                            //console.log("Success loading related bands");

                        }, this),

                        error: function (collection, response, options) {
                            //console.log("Error");
                        }

                    });

                } else {

                    this._childrenLoaded = false;

                    this.model.clearRelatedBands({ isSourceOfReset: true });

                }

            },

            _showBandInfo: function() {

                this.trigger("graph-vector:show-band-info", this.model, this.$el);

            }

        });

    }
);