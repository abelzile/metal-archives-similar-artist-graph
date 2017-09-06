'use strict';
import * as $ from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import Template from '../../../templates/graph-vector.txt';
import { BandRelatedQuery } from '../collections/band-related-query';
import { NumberExt } from '../utils/number-ext';

export const GraphVector = Backbone.View.extend({
  POSITION_OFFSET: -40,

  _childrenLoaded: false,

  template: _.template(Template),

  events: {
    'click .graph-vector-expand-related-wrapper > .toggle-link': '_showHideRelated',

    'click .graph-vector-expand-details-wrapper > .info-link': '_showBandInfo',

    click: function() {
      this.trigger('graph-vector:focus', this);
    }
  },

  initialize: function(options) {
    Object.defineProperties(this, {
      x: {
        get: function() {
          return this._x;
        },
        set: function(val) {
          this.prevX = this._x;
          this._x = NumberExt.toInteger(val);
        },
        enumerable: true
      },
      y: {
        get: function() {
          return this._y;
        },
        set: function(val) {
          this.prevY = this._y;
          this._y = NumberExt.toInteger(val);
        },
        enumerable: true
      },
      prevX: {
        get: function() {
          return this._prevX;
        },
        set: function(val) {
          this._prevX = val;
        },
        enumerable: true
      },
      prevY: {
        get: function() {
          return this._prevY;
        },
        set: function(val) {
          this._prevY = val;
        },
        enumerable: true
      },
      hasMoved: {
        get: function() {
          return this.x !== this.prevX || this.y !== this.prevY;
        },
        enumerable: true
      }
    });

    _.extend(this, _.pick(options, 'x', 'y', 'prevX', 'prevY', 'z'));

    this.$el.addClass('graph-vector').css({
      left: this.x + this.POSITION_OFFSET + 'px',
      top: this.y + this.POSITION_OFFSET + 'px',
      zIndex: this.z
    });
  },

  render: function() {
    const data = this.model.toJSON();

    _.extend(data, {
      toggleFontClass: this._childrenLoaded ? 'fa-minus-circle' : 'fa-plus-circle',
      toggleDecoClass: this._childrenLoaded ? 'toggle-link-glow-on' : 'toggle-link-glow-off'
    });

    this.$el.html(this.template(data));

    return this;
  },

  remove: function() {
    this.$el.fadeOut(
      'fast',
      _.bind(function() {
        Backbone.View.prototype.remove.call(this);
      }, this)
    );

    return this;
  },

  animate: function() {
    const dfd = $.Deferred();

    this.$el.animate(
      {
        left: this.x + this.POSITION_OFFSET + 'px',
        top: this.y + this.POSITION_OFFSET + 'px'
      },
      'fast',
      'swing',
      function() {
        dfd.resolve();
      }
    );

    return dfd.promise();
  },

  setZIndex: function(z) {
    this.$el.css({ zIndex: z });
  },

  _showHideRelated: function() {
    if (!this._childrenLoaded) {
      this.trigger('graph-vector:showing-related');

      this.model.get('relatedBands').fetch({
        data: new BandRelatedQuery(this.model.get('id')).build(),

        parentBand: this.model,

        success: _.bind(function(collection, response, options) {
          this._childrenLoaded = true;

          this.trigger('graph-vector:showed-related');

          //console.log("Success loading related bands");
        }, this),

        error: function(collection, response, options) {
          //console.log("Error");
        }
      });
    } else {
      this._childrenLoaded = false;

      this.model.clearRelatedBands({ isSourceOfReset: true });
    }
  },

  _showBandInfo: function() {
    this.trigger('graph-vector:show-band-info', this.model, this.$el);
  }
});
