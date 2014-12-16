define(["jquery","underscore","backbone","app/collections/band-related-list","app/views/graph-vector","app/views/graph-edge","app/views/band-info","app/utils/math-ext","app/models/band","app/graphs/radial-tree-graph","app/graphs/radial-tree-node","app/utils/color"],function(a,b,c,d,e,f,g,h,i,j,k,l){"use strict";return c.View.extend({model:i,el:"#graph",$vectors:null,$edges:null,$rings:null,vectorViews:{},edgeViews:{},drawingContext:null,drawingContext2:null,bandInfoView:null,initialize:function(){this.$vectors=this.$el.find("#vector-graph"),this.$edges=this.$el.find("#edge-graph"),this.$rings=this.$el.find("#rings"),this.bandInfoView=new g({el:"#band-info-dialog",model:new i}),this.drawingContext=this.$edges[0].getContext("2d"),this.drawingContext2=this.$rings[0].getContext("2d"),this.listenTo(this.model,"change",this.render)},resize:function(a,b){this.$el.width(a).height(b);var c=this.$el.innerWidth(),d=this.$el.innerHeight();this.$vectors.width(c).height(d),this.$edges.attr({width:c,height:d}),this.$rings.attr({width:c,height:d})},start:function(a){this._cleanUpCurrentModel(),this.stopListening(a.get("relatedBands")),this.model.set(a.toJSON())},render:function(){return this.trigger("graph:rendering",this),this.$rings.fadeOut("fast"),this.$edges.fadeOut("fast",b.bind(function(){this._render()},this)),this},_cleanUpCurrentModel:function(){this.model.clearRelatedBands(),void 0!==this.vectorViews[this.model.cid]&&(this.vectorViews[this.model.cid].remove(),delete this.vectorViews[this.model.cid]),void 0!==this.edgeViews[this.model.cid]&&(this.edgeViews[this.model.cid].remove(),delete this.edgeViews[this.model.cid])},_render:function(){this._clearCanvases();var b=this.$el.innerWidth(),c=this.$el.innerHeight(),d=this._buildTree(),e=d.toLevelArray();(new j).run(d,b,c);var f=this._renderVectors(d);this._renderEdges(d),this._renderRings(e),a.when.apply(a,f).then(this._animateOvalCanvas.bind(this)).then(this._animateEdgeCanvas.bind(this)).done(function(){this.trigger("graph:rendered",this)}.bind(this))},_clearCanvases:function(){this.drawingContext.clearRect(0,0,this.$el.innerWidth(),this.$el.innerHeight()),this.drawingContext2.clearRect(0,0,this.$el.innerWidth(),this.$el.innerHeight())},_buildLevelsArray:function(a,c){var d=a.children;d.length>0&&c[a.level].push(b.map(d)),b.forEach(d,function(a){this._buildLevelsArray(a,c)},this)},_findAngleDiffs:function(a){for(var b=h.TWO_PI,c=0,d=0;d<a.length;++d){var e=a[d].angle;if(d+1>=a.length)break;var f=a[d+1].angle,g=Math.abs(e-f);b>g&&(b=g),g>c&&(c=g)}return{smallest:b,biggest:c}},_renderRings:function(a){for(var c=a.length,d=c,e=0;e<a.length;++e)d+=a[e].length;var f=l.createGradient(l.createFromHex("#eef2f3"),l.createFromHex("#8e9eab"),d),g=this.drawingContext2,i=this.$el.innerWidth(),j=this.$el.innerHeight(),k=i/2,m=j/2,n=k/c,o=m/c;b.forEachRight(a,function(a,c){var d,e,i=n*c+n/2,j=o*c+o/2;g.beginPath(),b.forEach(b.range(0,h.TWO_PI,.01),function(a){d=k-i*Math.cos(a),e=m+j*Math.sin(a),0===a?g.moveTo(d,e):g.lineTo(d,e)},this),g.fillStyle=f.shift().toRgbString(),g.fill(),g.closePath(),b.forEach(a,function(a){var c=b.first(a).angle,h=b.last(a).angle,l=this._findAngleDiffs(a),n=(l.smallest,l.biggest);c-=n/2,h+=n/2,g.beginPath(),g.moveTo(k,m),b.forEach(b.range(c,h,.01),function(a){d=k+i*Math.cos(a),e=m+j*Math.sin(a),g.lineTo(d,e)},this),g.lineTo(k,m),g.fillStyle=f.shift().toRgbString(),g.fill(),g.closePath()},this)},this)},_renderVectors:function(a){b.forEach(a.toFlatArray(),function(a){var b=this._ensureVectorView(a.data);return b.x=a.x,b.y=a.y,this.$vectors.append(b.render().$el),b.hasMoved?b.animate():void 0},this)},_renderEdges:function(a){b.forEach(a.toFlatArray(),function(a){var c=this._ensureEdgeView(a.data);c.startX=a.x,c.startY=a.y;var d=a.data.get("parentBand"),e=0;if(null!==d){var f=this._ensureEdgeView(d);c.endX=f.startX,c.endY=f.startY,e=b.max(d.get("relatedBands").models,function(a){return a.get("score")}).get("score")}else c.endX=c.startX,c.endY=c.startY;c.render({highScore:e})},this)},_animateEdgeCanvas:function(){var b=a.Deferred();return this.$edges.fadeIn("fast",function(){b.resolve()}),b.promise()},_animateOvalCanvas:function(){var b=a.Deferred();return this.$rings.fadeIn("fast",function(){b.resolve()}),b.promise()},_ensureVectorView:function(a){var b=this._getVectorViewByModelCid(a.cid);if(null!==b)return b;var c=this.$el.innerWidth(),d=this.$el.innerHeight(),f=c/2,g=d/2,h=a.get("parentBand");if(null!==h){var i=this._ensureVectorView(h);f=i.x,g=i.y}return b=new e({model:a,x:f,y:g,prevX:f,prevY:g}),this.vectorViews[a.cid]=b,this._addViewListeners(b)},_ensureEdgeView:function(a){var b=this._getEdgeViewByModelCid(a.cid);return null!==b?b:(b=new f({model:a,canvas:this.$edges[0],drawingContext:this.drawingContext,startX:0,startY:0,endX:0,endY:0}),this.edgeViews[a.cid]=b,b)},_addViewListeners:function(a){return this.listenTo(a.model.get("relatedBands"),"reset",b.bind(function(a,b){this._updateViews(a.models,b.previousModels),b.isSourceOfReset&&this.render()},this)),this.listenTo(a,"graph-vector:show-band-info",b.bind(function(a,b){this.bandInfoView.model.set(a.toJSON()),this.bandInfoView.render({position:{my:"center top-25",at:"center bottom",of:b}})},this)),this.listenTo(a,"graph-vector:showing-related",b.bind(function(){this.trigger("graph:showing-related")},this)),a},_buildTree:function(){var a=new k(this.model);return this._buildTreeN(this.model.get("relatedBands"),a),this._setTreeLevels(a,1),a},_buildTreeN:function(a,c){b.forEach(a.models,function(a){if(!this._isAncestor(c,a)){var b=new k(a);c.addChild(b),this._buildTreeN(a.get("relatedBands"),b)}},this)},_setTreeLevels:function(a,c){a.level=c,b.forEach(a.children,function(a){this._setTreeLevels(a,c+1)},this)},_isAncestor:function(a,b){for(var c=a.data;null!==c;){if(c.get("id")===b.get("id"))return!0;c=c.get("parentBand")}return!1},_getVectorViewByModelCid:function(a){return b.has(this.vectorViews,a)?this.vectorViews[a]:null},_getEdgeViewByModelCid:function(a){return b.has(this.edgeViews,a)?this.edgeViews[a]:null},_updateViews:function(a,c){var d=b.pluck(a,"cid"),e=b.pluck(c,"cid"),f=b.difference(d,e),g=b.difference(e,d);b.forEach(g,function(a){this.vectorViews[a].remove(),delete this.vectorViews[a],this.edgeViews[a].remove(),delete this.edgeViews[a]},this),b.forEach(f,function(c){var d=b.find(a,{cid:c});this._ensureVectorView(d),this._ensureEdgeView(d)},this)}})});