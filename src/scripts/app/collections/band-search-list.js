'use strict';
import * as _ from 'lodash';
import { BandList } from './band-list';
import { BandSearchItemParser } from './band-search-item-parser';
import { BandRelatedList } from './band-related-list';
import { Band } from '../models/band';

export const BandSearchList = BandList.extend({
  parse: function(response) {
    if (response.query.results.json.iTotalRecords === 0) {
      return [];
    }

    return _.map(response.query.results.json.aaData, function(val) {
      const parser = new BandSearchItemParser(val);

      return new Band({
        id: parser.getId(),
        name: parser.getFullName(),
        genre: parser.getGenre(),
        country: parser.getCountry(),
        score: 0,
        parentBand: null,
        relatedBands: new BandRelatedList()
      });
    });
  }
});
