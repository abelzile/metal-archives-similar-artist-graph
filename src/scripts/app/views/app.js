'use strict';
import * as $ from 'jquery';
import Backbone from 'backbone';
import { Band } from '../models/band';
import { BandSearchList } from '../collections/band-search-list';
import { GraphView } from './graph';
import { SearchView } from './search';

export const AppView = Backbone.View.extend({
  el: '#the-app',

  $window: null,

  $loadingOverlay: null,

  $loadingMsg: '',

  searchView: null,

  graphView: null,

  initialize: function() {
    (this.$window = $(window)).on('resize', this.resizeLayout.bind(this));
    this.$loadingOverlay = this.$el.find('#loading-overlay');
    this.$loadingMsg = this.$loadingOverlay.find('#loading-msg');

    const bandSearchList = new BandSearchList();

    this.searchView = new SearchView({ collection: bandSearchList });

    this.graphView = new GraphView({ model: new Band() });
    this.graphView.listenTo(
      this.searchView,
      'search:select',
      function(model) {
        this.graphView.start(model);
      }.bind(this)
    );

    this.listenTo(this.searchView, 'search:searching', function() {
      this._showLoadingMsg('Searching...');
    })
      .listenTo(this.searchView, 'search:searched', function() {
        this._hideLoadingMsg();
      })
      .listenTo(this.graphView, 'graph:rendering', function() {
        this._showLoadingMsg('Updating graph...');
      })
      .listenTo(this.graphView, 'graph:rendered', function() {
        this._hideLoadingMsg();
      })
      .listenTo(this.graphView, 'graph:showing-related', function() {
        this._showLoadingMsg('Querying...');
      });

    this.resizeLayout();
  },

  resizeLayout: function() {
    const winWidth = this.$window.innerWidth();
    const winHeight = this.$window.innerHeight();

    this.$loadingOverlay.width(winWidth).height(winHeight);

    this.graphView.resize(winWidth, winHeight);
  },

  _showLoadingMsg: function(msg) {
    this.$loadingMsg.text(msg);
    if (this.$loadingOverlay.is(':hidden')) {
      this.$loadingOverlay.fadeIn('fast');
    }
  },

  _hideLoadingMsg: function() {
    this.$loadingMsg.text('');
    this.$loadingOverlay.fadeOut('fast');
  }
});
