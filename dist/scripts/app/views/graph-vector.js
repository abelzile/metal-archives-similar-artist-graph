define(["jquery","underscore","backbone","text!templ/graph-vector.html","app/utils/math-ext","app/models/band","app/collections/band-related-list","app/collections/band-related-query","app/utils/number-ext"],function(a,b,c,d,e,f,g,h,i){"use strict";return c.View.extend({POSITION_OFFSET:-40,_childrenLoaded:!1,template:b.template(d),events:{"click .graph-vector-expand-related-wrapper > .toggle-link":"_showHideRelated","click .graph-vector-expand-details-wrapper > .info-link":"_showBandInfo"},initialize:function(a){Object.defineProperties(this,{x:{get:function(){return this._x},set:function(a){this.prevX=this._x,this._x=i.toInteger(a)},enumerable:!0},y:{get:function(){return this._y},set:function(a){this.prevY=this._y,this._y=i.toInteger(a)},enumerable:!0},prevX:{get:function(){return this._prevX},set:function(a){this._prevX=a},enumerable:!0},prevY:{get:function(){return this._prevY},set:function(a){this._prevY=a},enumerable:!0},hasMoved:{get:function(){return this.x!==this.prevX||this.y!==this.prevY},enumerable:!0}}),b.extend(this,b.pick(a,"x","y","prevX","prevY")),this.$el.addClass("graph-vector").css({left:this.x+this.POSITION_OFFSET+"px",top:this.y+this.POSITION_OFFSET+"px"})},render:function(){var a=this.model.toJSON();return b.extend(a,{toggleFontClass:this._childrenLoaded?"fa-minus-circle":"fa-plus-circle",toggleDecoClass:this._childrenLoaded?"toggle-link-glow-on":"toggle-link-glow-off"}),this.$el.html(this.template(a)),this},remove:function(){return this.$el.fadeOut("fast",b.bind(function(){c.View.prototype.remove.call(this)},this)),this},animate:function(){var b=a.Deferred();return this.$el.animate({left:this.x+this.POSITION_OFFSET+"px",top:this.y+this.POSITION_OFFSET+"px"},"fast","swing",function(){b.resolve()}),b.promise()},_showHideRelated:function(){this._childrenLoaded?(this._childrenLoaded=!1,this.model.clearRelatedBands({isSourceOfReset:!0})):(this.trigger("graph-vector:showing-related"),this.model.get("relatedBands").fetch({data:new h(this.model.get("id")).build(),parentBand:this.model,success:b.bind(function(){this._childrenLoaded=!0,this.trigger("graph-vector:showed-related")},this),error:function(){}}))},_showBandInfo:function(){this.trigger("graph-vector:show-band-info",this.model,this.$el)}})});