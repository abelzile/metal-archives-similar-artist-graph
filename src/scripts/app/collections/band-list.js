'use strict';
import * as _ from 'lodash';
import Backbone from 'backbone';
import { Band } from '../models/band';

export const BandList = Backbone.Collection.extend({
  model: Band,

  url: 'https://query.yahooapis.com/v1/public/yql',

  fetch: function(options) {
    return Backbone.Collection.prototype.fetch.call(
      this,
      _.extend(
        {
          reset: true,

          dataType: 'jsonp'
        },
        options
      )
    );
  }
});
