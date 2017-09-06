'use strict';
import * as _ from 'lodash';

export function BandRelatedItemParser(relatedResult) {
  this._$relatedResultTr = relatedResult;
}

_.extend(BandRelatedItemParser.prototype, {
  isValid: function() {
    if (typeof this._$relatedResultTr.id === 'undefined') {
      return false; // a 'show more' or 'no results' link.
    }
    return true;
  },

  getId: function() {
    return this._$relatedResultTr.id.substr(this._$relatedResultTr.id.indexOf('_') + 1);
  },

  getFullName: function() {
    return this._$relatedResultTr.td[0].a.content;
  },

  getGenre: function() {
    return this._$relatedResultTr.td[2];
  },

  getCountry: function() {
    return this._$relatedResultTr.td[1];
  },

  getScore: function() {
    return parseInt(this._$relatedResultTr.td[3].span.content, 10);
  }
});
