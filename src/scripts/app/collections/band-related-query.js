'use strict';
import * as _ from 'lodash';

export function BandRelatedQuery(bandId) {
  this._bandId = bandId;
}

BandRelatedQuery.QUERY_STRING =
  "select * from htmlstring where url='http://www.metal-archives.com/band/ajax-recommendations/id/{bandId}' and xpath='//tbody/tr'";

_.extend(BandRelatedQuery.prototype, {
  build: function() {
    return {
      q: BandRelatedQuery.QUERY_STRING.replace(/{bandId}/gi, this._bandId),
      format: 'json',
      env: 'store://datatables.org/alltableswithkeys'
    };
  }
});
