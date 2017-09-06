'use strict';
import * as _ from 'lodash';

export function BandSearchItemParser(searchResult) {
  if (_.isArray(searchResult)) {
    this._searchResult = searchResult; // Single band returned by search.
  } else {
    this._searchResult = searchResult.json; // Multiple bands returned by search.
  }
}

BandSearchItemParser.AKA_TOKEN = '<strong>a.k.a.</strong>';

_.extend(BandSearchItemParser.prototype, {
  getId: function() {
    const str = this._searchResult[0];
    const end = str.indexOf('</a>') + 4;
    const a = str.substring(0, end);
    const url = a.match(/".*?"/);
    const urlParts = url[0].substr(1, url[0].length - 2).split('/');

    return urlParts[urlParts.length - 1];
  },

  getName: function() {
    const str = this._searchResult[0];
    const end = str.indexOf('</a>') + 4;
    const a = str.substring(0, end);

    return a.substring(a.indexOf('>') + 1, a.indexOf('</a>'));
  },

  getAka: function() {
    const str = this._searchResult[0];
    const akaIndex = str.indexOf(BandSearchItemParser.AKA_TOKEN);

    if (akaIndex > -1) {
      return str.substring(akaIndex + BandSearchItemParser.AKA_TOKEN.length, str.lastIndexOf(')'));
    }

    return '';
  },

  getFullName: function() {
    const name = this.getName();
    const aka = this.getAka();

    if (aka !== '') {
      return name + ' (a.k.a. ' + aka + ')';
    }

    return name;
  },

  getGenre: function() {
    return this._searchResult[1];
  },

  getCountry: function() {
    return this._searchResult[2];
  }
});
