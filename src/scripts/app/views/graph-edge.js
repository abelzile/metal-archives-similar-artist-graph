define(["jquery",
        "underscore",
        "backbone"],
    function ($,
              _,
              Backbone) {

    "use strict";

    return Backbone.View.extend({

        LINE_COLOR: "#555",

        DEFAULT_LINE_WIDTH: 1,

        MAX_LINE_WIDTH: 8,

        initialize: function(options) {

            _.extend(this, _.pick(options, "startX", "startY", "endX", "endY", "canvas", "drawingContext"));

        },

        render: function(options) {

            var lineWidth = this.DEFAULT_LINE_WIDTH;
            var score = this.model.get("score");

            if (options.highScore > 0) {

                var ratio = score / options.highScore;

                lineWidth = ratio * this.MAX_LINE_WIDTH;

                if (lineWidth < this.DEFAULT_LINE_WIDTH) {
                    lineWidth = this.DEFAULT_LINE_WIDTH;
                }

            }

            this._drawLine(lineWidth, this.startX, this.startY, this.endX, this.endY);

        },

        _drawLine: function(lineWidth, startX, startY, endX, endY) {

            var context = this.drawingContext;
            context.fillStyle = this.LINE_COLOR;
            context.strokeStyle = this.LINE_COLOR;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();

        }

    });

});