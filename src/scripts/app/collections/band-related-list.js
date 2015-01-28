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

                if (count === 1) {

                    var parser = new BandRelatedItemParser(rows);

                    if (parser.isValid()) {
                        return this._buildBand(parser, options);
                    }

                } else {

                    var drop = 0;
                    if (rows.length > this.MAX_RESULTS) {
                        drop = rows.length - this.MAX_RESULTS;
                    }

                    return _.dropRight(rows, drop).map(function (val) {

                        var parser = new BandRelatedItemParser(val);

                        if (parser.isValid()) {
                            return this._buildBand(parser, options);
                        }

                    }, this);

                }

            },

            reset: function(models, options) {

                options = options || { isSourceOfReset: true };

                if (!_.has(options, "isSourceOfReset")) {
                    options.isSourceOfReset = true;
                }

                return Backbone.Collection.prototype.reset.call(this, models, options);

            },

            _buildBand: function(parser, options) {

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

    }

);