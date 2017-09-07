'use strict';
import * as _ from 'lodash';

export function BandRelatedItemParser($relatedResult) {
  this._$relatedResultTr = $relatedResult;
}

_.extend(BandRelatedItemParser.prototype, {
  isValid: function() {
    return !!this._$relatedResultTr.attr('id');
  },

  getId: function() {
    return this._$relatedResultTr.attr('id').substr(this._$relatedResultTr.attr('id').indexOf('_') + 1);
  },

  getFullName: function() {
    const a = this._$relatedResultTr.find("td:eq(0) > a");
    return a.text();
  },

  getGenre: function() {
    return this._$relatedResultTr.find("td:eq(2)").text();
  },

  getCountry: function() {
    return this._$relatedResultTr.find("td:eq(1)").text();
  },

  getScore: function() {
    return parseInt(this._$relatedResultTr.find("td:eq(3) > span").text(), 10);
  }
});
