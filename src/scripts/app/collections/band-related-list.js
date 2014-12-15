define(["require",
        "underscore",
        "backbone",
        "app/models/band",
        "app/collections/band-list",
        "app/collections/band-related-item-parser"],
    function (require,
              _,
              Backbone,
              Band,
              BandList,
              BandRelatedItemParser) {

        "use strict";

        return BandList.extend({

            MAX_RESULTS: 10,

            parse: function(response, options) {

                var queryResponse = response.query;
                var count = queryResponse.count;
                var rows = queryResponse.results.tr;

                if (count === 0 || (count === 1 && rows.td.id === "no_artists")) {
                    return [];
                }

                return _.initial(rows, rows.length - Math.min(rows.length, this.MAX_RESULTS)).map(function (val) {

                    var parser = new BandRelatedItemParser(val);

                    if (parser.isValid()) {

                        return new Band({
                            "id": parser.getId(),
                            "name": parser.getFullName(),
                            "genre": parser.getGenre(),
                            "country": parser.getCountry(),
                            "score": parser.getScore(),
                            "parentBand": options.parentBand,
                            "relatedBands": new (require("app/collections/band-related-list"))()
                        });

                    }

                });

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