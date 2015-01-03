define(["jquery",
        "underscore",
        "backbone",
        "app/collections/band-related-list",
        "app/views/graph-vector",
        "app/views/graph-edge",
        "app/views/band-info",
        "app/utils/math-ext",
        "app/models/band",
        "app/graphs/radial-tree-graph",
        "app/graphs/radial-tree-node",
        "app/utils/color"],
    function ($,
              _,
              Backbone,
              BandRelatedList,
              GraphVector,
              GraphEdge,
              BandInfo,
              MathExt,
              Band,
              RadialTreeGraph,
              RadialTreeNode,
              Color) {

        "use strict";

        return Backbone.View.extend({

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

                this.$vectors = this.$el.find("#vector-graph");
                this.$edges = this.$el.find("#edge-graph");
                this.$rings = this.$el.find("#rings");

                this.bandInfoView = new BandInfo({ el: "#band-info-dialog", model: new Band() });

                this.drawingContext = this.$edges[0].getContext("2d");
                this.drawingContext2 = this.$rings[0].getContext("2d");

                this.listenTo(this.model, "change", this.render);

            },

            resize: function(w, h) {

                this.$el.width(w).height(h);

                var innerWidth = this.$el.innerWidth();
                var innerHeight = this.$el.innerHeight();

                this.$vectors.width(innerWidth).height(innerHeight);
                this.$edges.attr({ "width": innerWidth, "height": innerHeight });
                this.$rings.attr({ "width": innerWidth, "height": innerHeight });

            },

            start: function(model) {

                this._cleanUpCurrentModel();

                this.stopListening(model.get("relatedBands"));

                this.z = 100;

                this.model.set(model.toJSON());

            },

            render: function() {

                this.trigger("graph:rendering", this);

                this.$rings.fadeOut("fast");
                this.$edges.fadeOut("fast", _.bind(function() {
                    this._render();
                }, this));

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

                var innerWidth = this.$el.innerWidth();
                var innerHeight = this.$el.innerHeight();
                var tree = this._buildTree();
                var levels = tree.toLevelArray();

                new RadialTreeGraph().run(tree, innerWidth, innerHeight);

                var vectorAnimationPromises = this._renderVectors(tree);
                this._renderEdges(tree);
                this._renderRings(levels);

                $.when
                    .apply($, vectorAnimationPromises)
                    .then(this._animateOvalCanvas.bind(this))
                    .then(this._animateEdgeCanvas.bind(this))
                    .done(function() {
                        this.trigger("graph:rendered", this);
                    }.bind(this));

            },

            _clearCanvases: function() {

                this.drawingContext.clearRect(0, 0, this.$el.innerWidth(), this.$el.innerHeight());
                this.drawingContext2.clearRect(0, 0, this.$el.innerWidth(), this.$el.innerHeight());

            },

            _buildLevelsArray: function(tree, levels) {

                var children = tree.children;

                if (children.length > 0) {
                    levels[tree.level].push(_.map(children));
                }

                _.forEach(children, function(child) {
                    this._buildLevelsArray(child, levels);
                }, this);

            },

            _findAngleDiffs: function(children){

                var smallest = MathExt.TWO_PI;
                var biggest = 0;

                for (var m = 0; m < children.length; ++m) {

                    var a1 = children[m].angle;

                    if (m + 1 >= children.length) {
                        break;
                    }

                    var a2 = children[m + 1].angle;

                    var diff = Math.abs(a1 - a2);

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

                var maxLevel = levels.length;
                var maxColors = maxLevel;

                for (var i = 0; i < levels.length; ++i) {
                    maxColors += levels[i].length;
                }

                var colors = Color.createGradient(Color.createFromHex("#eef2f3"), Color.createFromHex("#8e9eab"), maxColors);

                var ctx = this.drawingContext2;
                var innerWidth = this.$el.innerWidth();
                var innerHeight = this.$el.innerHeight();
                var centerX = innerWidth / 2;
                var centerY = innerHeight / 2;
                var stepX = centerX / maxLevel;
                var stepY = centerY / maxLevel;

                _.forEachRight(levels, function(levelArray, i) {

                    var radX = stepX * i + (stepX / 2);
                    var radY = stepY * i + (stepY / 2);
                    var xPos, yPos;

                    ctx.beginPath();

                    _.forEach(_.range(0, MathExt.TWO_PI, 0.01), function(val) {

                        xPos = centerX - (radX * Math.cos(val));
                        yPos = centerY + (radY * Math.sin(val));

                        if (val === 0) {
                            ctx.moveTo(xPos, yPos);
                        } else {
                            ctx.lineTo(xPos, yPos);
                        }

                    }, this);

                    ctx.fillStyle = colors.shift().toRgbString();
                    ctx.fill();
                    ctx.closePath();

                    _.forEach(levelArray, function(children) {

                        var startAngle = _.first(children).angle;
                        var endAngle = _.last(children).angle;

                        var diffs = this._findAngleDiffs(children);
                        var smallest = diffs.smallest;
                        var biggest = diffs.biggest;

                        startAngle -= biggest / 2;
                        endAngle += biggest / 2;

                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);

                        _.forEach(_.range(startAngle, endAngle, 0.01), function(val) {

                            xPos = centerX + (radX * Math.cos(val));
                            yPos = centerY + (radY * Math.sin(val));

                            ctx.lineTo(xPos, yPos);

                        }, this);

                        ctx.lineTo(centerX, centerY);
                        ctx.fillStyle = colors.shift().toRgbString();
                        ctx.fill();
                        ctx.closePath();

                    }, this);

                }, this);

            },

            _renderVectors: function (tree) {

                _.forEach(tree.toFlatArray(), function (node) {

                    var vectorView = this._ensureVectorView(node.data);
                    vectorView.x = node.x;
                    vectorView.y = node.y;

                    this.$vectors.append(vectorView.render().$el);

                    if (vectorView.hasMoved) {
                        return vectorView.animate();
                    }

                }, this);

            },

            _renderEdges: function (tree) {

                _.forEach(tree.toFlatArray(), function (node) {

                    var edgeView = this._ensureEdgeView(node.data);
                    edgeView.startX = node.x;
                    edgeView.startY = node.y;

                    var parentBand = node.data.get("parentBand");
                    var highScore = 0;

                    if (parentBand !== null) {

                        var parentEdgeView = this._ensureEdgeView(parentBand);
                        edgeView.endX = parentEdgeView.startX;
                        edgeView.endY = parentEdgeView.startY;

                        highScore = _.max(parentBand.get("relatedBands").models, function(band) { return band.get("score"); }).get("score");

                    } else {

                        // root node.
                        edgeView.endX = edgeView.startX;
                        edgeView.endY = edgeView.startY;

                    }

                    edgeView.render({ "highScore": highScore });

                }, this);

            },

            _animateEdgeCanvas: function() {

                var dfd = $.Deferred();

                this.$edges.fadeIn("fast", function() {
                    dfd.resolve();
                });

                return dfd.promise();

            },

            _animateOvalCanvas: function() {

                var dfd = $.Deferred();

                this.$rings.fadeIn("fast", function() {
                    dfd.resolve();
                });

                return dfd.promise();

            },

            _ensureVectorView: function(band) {

                var view = this._getVectorViewByModelCid(band.cid);

                if (view !== null) {
                    return view;
                }

                var innerWidth = this.$el.innerWidth();
                var innerHeight = this.$el.innerHeight();

                var x = innerWidth / 2, y = innerHeight / 2;

                var parentBand = band.get("parentBand");

                if (parentBand !== null) {
                    var parentVectorView = this._ensureVectorView(parentBand);
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

                var view = this._getEdgeViewByModelCid(band.cid);

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
                        view.model.get("relatedBands"),
                        "reset",
                        _.bind(function (collection, options) {

                            this._updateViews(collection.models, options.previousModels);

                            if (options.isSourceOfReset) {
                                this.render();
                            }

                        }, this))
                    .listenTo(
                        view,
                        "graph-vector:show-band-info",
                        _.bind(function (model, $opener) {

                            this.bandInfoView.model.set(model.toJSON());
                            this.bandInfoView.render({ position: { my: "center top-25", at: "center bottom", of: $opener } });

                        }, this))
                    .listenTo(
                        view,
                        "graph-vector:showing-related",
                        _.bind(function() {
                            this.trigger("graph:showing-related");
                        }, this))
                    .listenTo(
                        view,
                        "graph-vector:focus",
                        _.bind(function(vw) {
                            vw.setZIndex(++this.z);
                        }, this));

                return view;

            },

            _buildTree: function() {

                var radialTreeNode = new RadialTreeNode(this.model);

                this._buildTreeN(this.model.get("relatedBands"), radialTreeNode);

                this._setTreeLevels(radialTreeNode, 1);

                return radialTreeNode;

            },

            _buildTreeN: function(bandCollection, node) {

                _.forEach(bandCollection.models, function(childBand) {

                    if (!this._isAncestor(node, childBand)) {

                        var child = new RadialTreeNode(childBand);

                        node.addChild(child);

                        this._buildTreeN(childBand.get("relatedBands"), child);

                    }

                }, this);

            },

            _setTreeLevels: function(node, level) {

                node.level = level;

                _.forEach(node.children, function(child) {
                    this._setTreeLevels(child, level + 1);
                }, this);

            },

            _isAncestor: function(node, band){

                var nodeBand = node.data;

                while (nodeBand !== null) {

                    if (nodeBand.get("id") === band.get("id")) {
                        return true;
                    }

                    nodeBand = nodeBand.get("parentBand");

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

                var currentModelIds = _.pluck(currentModels, "cid");
                var previousModelIds = _.pluck(previousModels, "cid");

                var inCurrentNotPrevious = _.difference(currentModelIds, previousModelIds);
                var inPreviousNotCurrent = _.difference(previousModelIds, currentModelIds);

                _.forEach(inPreviousNotCurrent, function(cid) {

                    this.vectorViews[cid].remove();
                    delete this.vectorViews[cid];

                    this.edgeViews[cid].remove();
                    delete this.edgeViews[cid];

                }, this);

                _.forEach(inCurrentNotPrevious, function(cid) {

                    var model = _.find(currentModels, { 'cid': cid });

                    this._ensureVectorView(model);
                    this._ensureEdgeView(model);

                }, this);

            }

        });

    }
);