'use strict';
import * as _ from 'lodash';
import Backbone from 'backbone';

export const Band = Backbone.Model.extend({
  clearRelatedBands: function(options) {
    options = options || { isSourceOfReset: true };

    if (!_.has(options, 'isSourceOfReset')) {
      options.isSourceOfReset = true;
    }

    const relatedBands = this.get('relatedBands');

    if (!relatedBands) {
      return;
    }

    _.forEach(relatedBands.models, function(band) {
      band.clearRelatedBands({ isSourceOfReset: false });
    });

    relatedBands.reset([], options);
  }
});
