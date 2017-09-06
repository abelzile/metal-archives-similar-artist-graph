'use strict';
import $ from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import { Band } from '../models/band';
import { BandInfoView } from './band-info';
import { Color } from '../utils/color';
import { GraphEdge } from "./graph-edge";
import { GraphVector } from './graph-vector';
import { MathExt } from '../utils/math-ext';
import { RadialTreeGraph } from '../graphs/radial-tree-graph';
import { RadialTreeNode } from '../graphs/radial-tree-node';

export const GraphView = Backbone.View.extend({
  model: Band,

  el: '#graph',

  $vectors: null,

  $edges: null,

  $rings: null,

  vectorViews: {},

  edgeViews: {},

  drawingContext: null,

  drawingContext2: null,

  bandInfoView: null,

  z: 100,

  initialize: function(options) {
    this.$vectors = this.$el.find('#vector-graph');
    this.$edges = this.$el.find('#edge-graph');
    this.$rings = this.$el.find('#rings');

    this.bandInfoView = new BandInfoView({ el: '#band-info-dialog', model: new Band() });

    this.drawingContext = this.$edges[0].getContext('2d');
    this.drawingContext2 = this.$rings[0].getContext('2d');

    this.listenTo(this.model, 'change', this.render);
  },

  resize: function(w, h) {
    this.$el.width(w).height(h);

    const innerWidth = this.$el.innerWidth();
    const innerHeight = this.$el.innerHeight();

    this.$vectors.width(innerWidth).height(innerHeight);
    this.$edges.attr({ width: innerWidth, height: innerHeight });
    this.$rings.attr({ width: innerWidth, height: innerHeight });
  },

  start: function(model) {
    this._cleanUpCurrentModel();

    this.stopListening(model.get('relatedBands'));

    this.z = 100;

    this.model.set(model.toJSON());
  },

  render: function() {
    this.trigger('graph:rendering', this);

    this.$rings.fadeOut('fast');
    this.$edges.fadeOut(
      'fast',
      _.bind(function() {
        this._render();
      }, this)
    );

    return this;
  },

  _cleanUpCurrentModel: function() {
    this.model.clearRelatedBands();

    if (this.vectorViews[this.model.cid] !== undefined) {
      this.vectorViews[this.model.cid].remove();
      delete this.vectorViews[this.model.cid];
    }

    if (this.edgeViews[this.model.cid] !== undefined) {
      this.edgeViews[this.model.cid].remove();
      delete this.edgeViews[this.model.cid];
    }
  },

  _render: function() {
    this._clearCanvases();

    const innerWidth = this.$el.innerWidth();
    const innerHeight = this.$el.innerHeight();
    const tree = this._buildTree();
    const levels = tree.toLevelArray();

    new RadialTreeGraph().run(tree, innerWidth, innerHeight);

    const vectorAnimationPromises = this._renderVectors(tree);
    this._renderEdges(tree);
    this._renderRings(levels);

    $.when
      .apply($, vectorAnimationPromises)
      .then(this._animateOvalCanvas.bind(this))
      .then(this._animateEdgeCanvas.bind(this))
      .done(
        function() {
          this.trigger('graph:rendered', this);
        }.bind(this)
      );
  },

  _clearCanvases: function() {
    this.drawingContext.clearRect(0, 0, this.$el.innerWidth(), this.$el.innerHeight());
    this.drawingContext2.clearRect(0, 0, this.$el.innerWidth(), this.$el.innerHeight());
  },

  _buildLevelsArray: function(tree, levels) {
    const children = tree.children;

    if (children.length > 0) {
      levels[tree.level].push(_.map(children));
    }

    _.forEach(
      children,
      function(child) {
        this._buildLevelsArray(child, levels);
      },
      this
    );
  },

  _findAngleDiffs: function(children) {
    let smallest = MathExt.TWO_PI;
    let biggest = 0;

    for (let m = 0; m < children.length; ++m) {
      const a1 = children[m].angle;

      if (m + 1 >= children.length) {
        break;
      }

      const a2 = children[m + 1].angle;

      const diff = Math.abs(a1 - a2);

      if (diff < smallest) {
        smallest = diff;
      }

      if (diff > biggest) {
        biggest = diff;
      }
    }

    return { smallest: smallest, biggest: biggest };
  },

  _renderRings: function(levels) {
    const maxLevel = levels.length;
    let maxColors = maxLevel;

    for (let i = 0; i < levels.length; ++i) {
      maxColors += levels[i].length;
    }

    const colors = Color.createGradient(Color.createFromHex('#eef2f3'), Color.createFromHex('#8e9eab'), maxColors);

    const ctx = this.drawingContext2;
    const innerWidth = this.$el.innerWidth();
    const innerHeight = this.$el.innerHeight();
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    const stepX = centerX / maxLevel;
    const stepY = centerY / maxLevel;

    _.forEachRight(
      levels,
      (levelArray, i) => {
        const radX = stepX * i + stepX / 2;
        const radY = stepY * i + stepY / 2;
        let xPos, yPos;

        ctx.beginPath();

        _.forEach(
          _.range(0, MathExt.TWO_PI, 0.01),
          (val) => {
            xPos = centerX - radX * Math.cos(val);
            yPos = centerY + radY * Math.sin(val);

            if (val === 0) {
              ctx.moveTo(xPos, yPos);
            } else {
              ctx.lineTo(xPos, yPos);
            }
          }
        );

        ctx.fillStyle = colors.shift().toRgbString();
        ctx.fill();
        ctx.closePath();

        _.forEach(
          levelArray,
          (children) => {
            let startAngle = _.first(children).angle;
            let endAngle = _.last(children).angle;

            const diffs = this._findAngleDiffs(children);
            const smallest = diffs.smallest;
            const biggest = diffs.biggest;

            startAngle -= biggest / 2;
            endAngle += biggest / 2;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);

            _.forEach(
              _.range(startAngle, endAngle, 0.01),
              (val) => {
                xPos = centerX + radX * Math.cos(val);
                yPos = centerY + radY * Math.sin(val);

                ctx.lineTo(xPos, yPos);
              }
            );

            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors.shift().toRgbString();
            ctx.fill();
            ctx.closePath();
          }
        );
      }
    );
  },

  _renderVectors: function(tree) {
    _.forEach(tree.toFlatArray(), node => {
      const vectorView = this._ensureVectorView(node.data);
      vectorView.x = node.x;
      vectorView.y = node.y;

      this.$vectors.append(vectorView.render().$el);

      if (vectorView.hasMoved) {
        return vectorView.animate();
      }
    });
  },

  _renderEdges: function(tree) {
    _.forEach(
      tree.toFlatArray(),
      (node) => {
        const edgeView = this._ensureEdgeView(node.data);
        edgeView.startX = node.x;
        edgeView.startY = node.y;

        const parentBand = node.data.get('parentBand');
        let highScore = 0;

        if (parentBand !== null) {
          const parentEdgeView = this._ensureEdgeView(parentBand);
          edgeView.endX = parentEdgeView.startX;
          edgeView.endY = parentEdgeView.startY;

          highScore = _.max(parentBand.get('relatedBands').models, function(band) {
            return band.get('score');
          }).get('score');
        } else {
          // root node.
          edgeView.endX = edgeView.startX;
          edgeView.endY = edgeView.startY;
        }

        edgeView.render({ highScore: highScore });
      }
    );
  },

  _animateEdgeCanvas: function() {
    const dfd = $.Deferred();

    this.$edges.fadeIn('fast', function() {
      dfd.resolve();
    });

    return dfd.promise();
  },

  _animateOvalCanvas: function() {
    const dfd = $.Deferred();

    this.$rings.fadeIn('fast', function() {
      dfd.resolve();
    });

    return dfd.promise();
  },

  _ensureVectorView: function(band) {
    let view = this._getVectorViewByModelCid(band.cid);

    if (view !== null) {
      return view;
    }

    const innerWidth = this.$el.innerWidth();
    const innerHeight = this.$el.innerHeight();

    let x = innerWidth / 2,
      y = innerHeight / 2;

    const parentBand = band.get('parentBand');

    if (parentBand !== null) {
      const parentVectorView = this._ensureVectorView(parentBand);
      x = parentVectorView.x;
      y = parentVectorView.y;
    }

    view = new GraphVector({
      model: band,
      x: x,
      y: y,
      prevX: x,
      prevY: y,
      z: ++this.z
    });

    this.vectorViews[band.cid] = view;

    return this._addVectorViewListeners(view);
  },

  _ensureEdgeView: function(band) {
    let view = this._getEdgeViewByModelCid(band.cid);

    if (view !== null) {
      return view;
    }

    view = new GraphEdge({
      model: band,
      canvas: this.$edges[0],
      drawingContext: this.drawingContext,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    });

    this.edgeViews[band.cid] = view;

    return view; // cleanup on reset handled by vector view.
  },

  _addVectorViewListeners: function(view) {
    this.listenTo(
      view.model.get('relatedBands'),
      'reset',
      _.bind(function(collection, options) {
        this._updateViews(collection.models, options.previousModels);

        if (options.isSourceOfReset) {
          this.render();
        }
      }, this)
    )
      .listenTo(
        view,
        'graph-vector:show-band-info',
        _.bind(function(model, $opener) {
          this.bandInfoView.model.set(model.toJSON());
          this.bandInfoView.render({ position: { my: 'center top-25', at: 'center bottom', of: $opener } });
        }, this)
      )
      .listenTo(
        view,
        'graph-vector:showing-related',
        _.bind(function() {
          this.trigger('graph:showing-related');
        }, this)
      )
      .listenTo(
        view,
        'graph-vector:focus',
        _.bind(function(vw) {
          vw.setZIndex(++this.z);
        }, this)
      );

    return view;
  },

  _buildTree: function() {
    const radialTreeNode = new RadialTreeNode(this.model);

    this._buildTreeN(this.model.get('relatedBands'), radialTreeNode);

    this._setTreeLevels(radialTreeNode, 1);

    return radialTreeNode;
  },

  _buildTreeN: function(bandCollection, node) {
    _.forEach(
      bandCollection.models,
      (childBand) => {
        if (!this._isAncestor(node, childBand)) {
          const child = new RadialTreeNode(childBand);

          node.addChild(child);

          this._buildTreeN(childBand.get('relatedBands'), child);
        }
      }
    );
  },

  _setTreeLevels: function(node, level) {
    node.level = level;

    _.forEach(
      node.children,
      (child) => {
        this._setTreeLevels(child, level + 1);
      }
    );
  },

  _isAncestor: function(node, band) {
    let nodeBand = node.data;

    while (nodeBand !== null) {
      if (nodeBand.get('id') === band.get('id')) {
        return true;
      }

      nodeBand = nodeBand.get('parentBand');
    }

    return false;
  },

  _getVectorViewByModelCid: function(modelCid) {
    if (_.has(this.vectorViews, modelCid)) {
      return this.vectorViews[modelCid];
    }
    return null;
  },

  _getEdgeViewByModelCid: function(modelCid) {
    if (_.has(this.edgeViews, modelCid)) {
      return this.edgeViews[modelCid];
    }
    return null;
  },

  _updateViews: function(currentModels, previousModels) {
    const currentModelIds = _.map(currentModels, 'cid');
    const previousModelIds = _.map(previousModels, 'cid');

    const inCurrentNotPrevious = _.difference(currentModelIds, previousModelIds);
    const inPreviousNotCurrent = _.difference(previousModelIds, currentModelIds);

    _.forEach(
      inPreviousNotCurrent,
      (cid) => {
        this.vectorViews[cid].remove();
        delete this.vectorViews[cid];

        this.edgeViews[cid].remove();
        delete this.edgeViews[cid];
      }
    );

    _.forEach(
      inCurrentNotPrevious,
      (cid) => {
        const model = _.find(currentModels, {cid: cid});

        this._ensureVectorView(model);
        this._ensureEdgeView(model);
      }
    );
  }
});
