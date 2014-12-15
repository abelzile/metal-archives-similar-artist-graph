define(["underscore"], function(_){

    "use strict";

    function BandRelatedItemParser(relatedResult){

        this._relatedResult = relatedResult;

    }

    _.extend(BandRelatedItemParser.prototype, {

        isValid: function() {

            if (typeof this._relatedResult.id === 'undefined') {
                return false; // a 'show more' or 'no results' link.
            }
            return true;

        },

        getId: function() {

            return this._relatedResult.id.substr(this._relatedResult.id.indexOf('_') + 1);

        },

        getFullName: function() {

            return this._relatedResult.td[0].a.content;

        },

        getGenre: function() {

            return this._relatedResult.td[2].p;

        },

        getCountry: function() {

            return this._relatedResult.td[1].p;

        },

        getScore: function() {

            return parseInt(this._relatedResult.td[3].span.content, 10);

        }

    });

    return BandRelatedItemParser;

});