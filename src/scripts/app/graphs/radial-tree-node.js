define(["underscore"], function (_) {

    "use strict";

    function RadialTreeNode(data) {

        this._data = data;
        this._children = [];
        this._angle = 0;
        this._x = 0;
        this._y = 0;
        this._rightBisector = 0;
        this._leftBisector = 0;
        this._rightTangent = 0;
        this._leftTangent = 0;
        this._level = 0;
        this._flatArrayCache = null;
        this._levelArrayCache = null;

    }

    Object.defineProperties(RadialTreeNode.prototype, {

        data: {
            get: function() { return this._data; },
            enumerable: true
        },
        children: {
            get: function() { return this._children; },
            enumerable: true
        },
        angle: {
            get: function() { return this._angle; },
            set: function(val) { this._angle = val; },
            enumerable: true
        },
        x: {
            get: function() { return this._x; },
            set: function(val) { this._x = val; },
            enumerable: true
        },
        y: {
            get: function() { return this._y; },
            set: function(val) { this._y = val; },
            enumerable: true
        },
        rightBisector: {
            get: function() { return this._rightBisector; },
            set: function(val) { this._rightBisector = val; },
            enumerable: true
        },
        leftBisector: {
            get: function() { return this._leftBisector; },
            set: function(val) { this._leftBisector = val; },
            enumerable: true
        },
        rightTangent: {
            get: function() { return this._rightTangent; },
            set: function(val) { this._rightTangent = val; },
            enumerable: true
        },
        leftTangent: {
            get: function() { return this._leftTangent; },
            set: function(val) { this._leftTangent = val; },
            enumerable: true
        },
        depth: {
            get: function() {

                var depth = 1;

                _.forEach(this._children, function(node) {

                    var childDepth = node.depth;

                    if (childDepth >= depth) {
                        depth = childDepth + 1;
                    }

                }, this);

                return depth;

            },
            enumerable: true
        },
        hasChildren: {
            get: function() { return this._children !== null && this._children.length > 0; },
            enumerable: true
        },
        leftLimit: {
            get: function() { return Math.min(this._leftBisector, this._leftTangent); },
            enumerable: true
        },
        rightLimit: {
            get: function() { return Math.max(this._rightBisector, this._rightTangent); },
            enumerable: true
        },
        level: {
            get: function() { return this._level; },
            set: function(val) { this._level = val; },
            enumerable: true
        }

    });

    _.extend(RadialTreeNode.prototype, {

        addChild: function(node) {
            this._children.push(node);
            this._flatArrayCache = null;
            this._levelArrayCache = null;
        },

        toFlatArray: function() {

            if (this._flatArrayCache !== null) {
                return this._flatArrayCache;
            }

            var arr = [this];
            var stack = [this];

            var add = function(c) {
                arr.push(c);
                stack.push(c);
            };

            while (stack.length > 0) {

                var node = stack.pop();

                _.forEach(node.children, add, this);

            }

            return (this._flatArrayCache = arr);

        },

        toLevelArray: function() {

            if (this._levelArrayCache !== null) {
                return this._levelArrayCache;
            }

            var levels = [[[this]]];

            this._toLevelArrayN(this, levels);

            return (this._levelArrayCache = levels);

        },

        _toLevelArrayN: function(tree, levels) {

            var children = tree.children;

            if (!tree.hasChildren) {
                return;
            }

            var treeLevel = tree.level;

            if (levels[treeLevel] === undefined) {
                levels[treeLevel] = [];
            }

            levels[treeLevel].push(_.map(children, function(node) { return node; }));

            _.forEach(children, function(node) {
                this._toLevelArrayN(node, levels);
            }, this);

        }

    });

    return RadialTreeNode;

});