'use strict';
import Backbone from 'backbone';

export const AboutView = Backbone.View.extend({
  el: '#about',

  initialize: function() {
    this.$el
      .dialog({
        autoOpen: true,
        closeOnEscape: false,
        draggable: true,
        height: 200,
        modal: false,
        position: { my: 'right top', at: 'right top', of: window },
        resizable: false,
        title: 'About',
        width: 400,
        dialogClass: 'no-close',
      }) /*.dialogExtend({
                    closable: false,
                    collapsable: true
                })*/
      .show('fast');
  }
});
