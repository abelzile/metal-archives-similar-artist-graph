'use strict';
import * as _ from 'lodash';
import { NumberExt } from './number-ext';

export function Color(r, g, b) {
  this._r = r;
  this._g = g;
  this._b = b;
}

Object.defineProperties(Color.prototype, {
  r: {
    get: function() {
      return this._r;
    },
    enumerable: true
  },
  g: {
    get: function() {
      return this._g;
    },
    enumerable: true
  },
  b: {
    get: function() {
      return this._b;
    },
    enumerable: true
  }
});

Color.createFromRgb = function(r, g, b) {
  return new Color(r, g, b);
};

Color.createFromHex = function(hexStr) {
  let h = hexStr;

  if (hexStr.charAt(0) === '#') {
    h = h.substring(1, 7);
  }

  return new Color(parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16));
};

Color.createGradient = function(startColor, endColor, steps) {
  return _.range(steps + 1).map(function(val, i) {
    return new Color(
      NumberExt.toInteger(Color._inter(startColor.r, endColor.r, i, steps)),
      NumberExt.toInteger(Color._inter(startColor.g, endColor.g, i, steps)),
      NumberExt.toInteger(Color._inter(startColor.b, endColor.b, i, steps))
    );
  });
};

Color._inter = function(start, end, step, max) {
  if (start < end) {
    return (end - start) * (step / max) + start;
  } else {
    return (start - end) * (1 - step / max) + end;
  }
};

_.extend(Color.prototype, {
  toRgbString: function() {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  },

  toHexString: function() {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  }
});
