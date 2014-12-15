define(["underscore"], function(_){

    "use strict";

    function BandRelatedQuery(bandId){

        this._bandId = bandId;

    }

    BandRelatedQuery.QUERY_STRING = "select * from html where url = 'http://www.metal-archives.com/band/ajax-recommendations/id/{bandId}' and xpath = '//tbody/tr'";

    _.extend(BandRelatedQuery.prototype, {

        build: function() {

            return {
                q: BandRelatedQuery.QUERY_STRING.replace(/{bandId}/gi, this._bandId),
                format: 'json'
            };

        }

    });

    return BandRelatedQuery;

});