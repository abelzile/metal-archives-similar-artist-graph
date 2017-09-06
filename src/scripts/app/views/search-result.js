'use strict';
import * as _ from 'lodash';
import Backbone from 'backbone';
import Template from '../../../templates/search-result.txt';

export const SearchResultView = Backbone.View.extend({
  tagName: 'tr',

  template: _.template(Template),

  events: {
    'click .search-link': function() {
      this.trigger('search-result:select', this.model);
    }
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});
