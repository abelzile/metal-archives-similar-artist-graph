'use strict';
import * as _ from 'lodash';
import Backbone from 'backbone';
import { Band } from '../models/band';
import { BandList } from './band-list';
import { BandRelatedItemParser2 } from './band-related-item-parser-2';

export const BandRelatedList = BandList.extend({
  MAX_RESULTS: 10,

  parse: function(response, options) {
    const queryResponse = response.query;
    const count = queryResponse.count;

    if (count === 0) {
      return [];
    }

    if (!queryResponse.results || !queryResponse.results.result) {
      return [];
    }

    const htmlString = queryResponse.results.result;

    const html = $.parseHTML(htmlString);
    const $obj = $('<table></table>');
    $obj.append(html);

    const result = $obj
      .find('tr')
      .map((i, el) => {
        if (i < this.MAX_RESULTS) {
          return null;
        }

        const $relatedResult = $(el);
        const parser = new BandRelatedItemParser2($relatedResult);

        if (parser.isValid()) {
          return this._buildBand(parser, options);
        }
        return null;
      })
      .get();

    return _.compact(result);
  },

  reset: function(models, options) {
    options = options || { isSourceOfReset: true };

    if (!_.has(options, 'isSourceOfReset')) {
      options.isSourceOfReset = true;
    }

    return Backbone.Collection.prototype.reset.call(this, models, options);
  },

  _buildBand: function(parser, options) {
    return new Band({
      id: parser.getId(),
      name: parser.getFullName(),
      genre: parser.getGenre(),
      country: parser.getCountry(),
      score: parser.getScore(),
      parentBand: options.parentBand,
      relatedBands: new BandRelatedList()
    });
  }
});
