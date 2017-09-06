'use strict';
import * as _ from 'lodash';

export function BandSearchQuery(bandName) {
  this._bandName = bandName;
}

BandSearchQuery.QUERY_STRING =
  "select * from json where url = 'http://www.metal-archives.com/search/ajax-advanced/searching/bands/?bandName={bandName}&exactBandMatch=1'";

_.extend(BandSearchQuery.prototype, {
  build: function() {
    return {
      q: BandSearchQuery.QUERY_STRING.replace(/{bandName}/gi, encodeURIComponent(this._bandName)),
      format: 'json'
    };
  }
});
