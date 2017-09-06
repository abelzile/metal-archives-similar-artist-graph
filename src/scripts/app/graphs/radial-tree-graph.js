'use strict';
import * as _ from 'lodash';
import { MathExt } from '../utils/math-ext';

export function RadialTreeGraph() {
  this._radiusX = 0;
  this._radiusY = 0;
  this._rootX = 0;
  this._rootY = 0;
  this._width = 0;
  this._height = 0;
}

Object.defineProperties(RadialTreeGraph.prototype, {
  radiusX: {
    get: function() {
      return this._radiusX;
    },
    set: function(val) {
      this._radiusX = val;
    },
    enumerable: true
  },
  radiusY: {
    get: function() {
      return this._radiusY;
    },
    set: function(val) {
      this._radiusY = val;
    },
    enumerable: true
  },
  rootX: {
    get: function() {
      return this._rootX;
    },
    set: function(val) {
      this._rootX = val;
    },
    enumerable: true
  },
  rootY: {
    get: function() {
      return this._rootY;
    },
    set: function(val) {
      this._rootY = val;
    },
    enumerable: true
  },
  width: {
    get: function() {
      return this._width;
    },
    set: function(val) {
      this._width = val;
    },
    enumerable: true
  },
  height: {
    get: function() {
      return this._height;
    },
    set: function(val) {
      this._height = val;
    },
    enumerable: true
  }
});

_.extend(RadialTreeGraph.prototype, {
  run: function(tree, width, height) {
    const depth = tree.depth;

    let w = this.width;
    if (this.width === this.rootX && this.rootX === this.radiusX && this.rootX === 0) {
      w = width;
    }

    if (w !== 0) {
      this.rootX = w / 2.0;
      this.radiusX = this.rootX / depth;
    }

    let h = this.height;
    if (this.height === this.rootY && this.rootY === this.radiusY && this.rootY === 0) {
      h = height;
    }

    if (h !== 0) {
      this.rootY = h / 2.0;
      this.radiusY = this.rootY / depth;
    }

    this.layoutTree(tree);
  },

  layoutTree: function(node) {
    node.angle = 0;
    node.x = this.rootX;
    node.y = this.rootY;
    node.rightBisector = 0;
    node.rightTangent = 0;
    node.leftBisector = MathExt.TWO_PI;
    node.leftTangent = MathExt.TWO_PI;

    this.layoutTreeN(1, [node]);
  },

  layoutTreeN: function(level, nodes) {
    let prevAngle = 0.0;
    let firstParent = null;
    let prevParent = null;
    const parentNodes = [];

    _.forEach(
      nodes,
      (parent) => {
        const children = parent.children;
        const rightLimit = parent.rightLimit;
        const angleSpace = (parent.leftLimit - rightLimit) / children.length;

        _.forEach(
          children,
          (node, i) => {
            node.angle = rightLimit + (i + 0.5) * angleSpace;
            node.x = this.rootX + level * this.radiusX * Math.cos(node.angle);
            node.y = this.rootY + level * this.radiusY * Math.sin(node.angle);

            if (node.hasChildren) {
              parentNodes.push(node);

              if (firstParent === null) {
                firstParent = node;
              }

              const prevGap = node.angle - prevAngle;
              node.rightBisector = node.angle - prevGap / 2.0;
              if (prevParent !== null) {
                prevParent.leftBisector = node.rightBisector;
              }

              const arcAngle = level / (level + 1.0);
              const arc = 2.0 * Math.asin(arcAngle);

              node.leftTangent = node.angle + arc;
              node.rightTangent = node.angle - arc;

              prevAngle = node.angle;
              prevParent = node;
            }
          }
        );
      }
    );

    if (firstParent !== null) {
      const remainingAngle = MathExt.TWO_PI - prevParent.angle;

      firstParent.rightBisector = (firstParent.angle - remainingAngle) / 2.0;

      if (firstParent.rightBisector < 0) {
        prevParent.leftBisector = firstParent.rightBisector + MathExt.TWO_PI + MathExt.TWO_PI;
      } else {
        prevParent.leftBisector = firstParent.rightBisector + MathExt.TWO_PI;
      }
    }

    if (parentNodes.length > 0) {
      this.layoutTreeN(level + 1, parentNodes);
    }
  }
});
