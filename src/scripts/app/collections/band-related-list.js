define(["require",
        "jquery",
        "underscore",
        "backbone",
        "app/models/band",
        "app/collections/band-list",
        "app/collections/band-related-item-parser"],
    function (require,
              $,
              _,
              Backbone,
              Band,
              BandList,
              BandRelatedItemParser) {

        "use strict";

        return BandList.extend({

            MAX_RESULTS: 10,

            parse: function(response, options) {

                var models = [];

                var queryResponse = response.query;

                if (queryResponse.count === 0) {
                    return models;
                }

                var responseRows = queryResponse.results.tr;

                if (queryResponse.count === 1 && responseRows.td.id === "no_artists") {
                    return models;
                }

                var max = Math.min(responseRows.length, this.MAX_RESULTS);

                for (var i = 0; i < max; ++i) {

                    var val = responseRows[i];

                    var parser = new BandRelatedItemParser(val);

                    if (!parser.isValid()) {
                        continue;
                    }

                    models.push(new Band({
                        "id": parser.getId(),
                        "name": parser.getFullName(),
                        "genre": parser.getGenre(),
                        "country": parser.getCountry(),
                        "score": parser.getScore(),
                        "parentBand": options.parentBand,
                        "relatedBands": new (require("app/collections/band-related-list"))()
                    }));

                }

                return models;

            },

            reset: function(models, options) {

                options = options || { isSourceOfReset: true };

                if (!_.has(options, "isSourceOfReset")) {
                    options.isSourceOfReset = true;
                }

                return Backbone.Collection.prototype.reset.call(this, models, options);

            }

        });

    }

);