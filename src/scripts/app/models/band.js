define(["jquery",
        "underscore",
        "backbone"],
    function ($,
              _,
              Backbone) {

        "use strict";

        return Backbone.Model.extend({

            clearRelatedBands: function(options) {

                options = options || { isSourceOfReset: true };

                if (!_.has(options, "isSourceOfReset")) {
                    options.isSourceOfReset = true;
                }

                var relatedBands = this.get("relatedBands");

                if (!relatedBands) {
                    return;
                }

                _.forEach(relatedBands.models, function(band) {
                    band.clearRelatedBands({ isSourceOfReset: false });
                });

                relatedBands.reset([], options);

            }

        });

    }
);