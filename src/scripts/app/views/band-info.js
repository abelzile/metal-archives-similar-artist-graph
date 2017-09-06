'use strict';
import * as _ from 'lodash';
import Backbone from 'backbone';
import Template from '../../../templates/info-dialog.txt';
import { Band } from '../models/band';
import { CountryCodes } from '../utils/country-codes';

export const BandInfoView = Backbone.View.extend({
  visible: false,

  model: Band,

  template: _.template(Template),

  dlg: null,

  initialize: function() {
    this.dlg = $('#band-info-dialog').dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      show: 100,
      hide: 100
    });
  },

  render: function(options) {
    options = options || { position: { my: 'center', at: 'center', of: window } };

    const mdl = this.model.toJSON();

    _.extend(mdl, {
      countryCode: CountryCodes[mdl.country] || 'xx'
    });

    this.$el.html(this.template(mdl));

    this.dlg.dialog('option', { title: this.model.get('name'), position: options.position }).dialog('open');

    return this;
  }
});
