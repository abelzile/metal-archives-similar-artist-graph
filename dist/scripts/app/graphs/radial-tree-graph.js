define(["underscore","app/utils/math-ext"],function(a,b){"use strict";function c(){this._radiusX=0,this._radiusY=0,this._rootX=0,this._rootY=0,this._width=0,this._height=0}return Object.defineProperties(c.prototype,{radiusX:{get:function(){return this._radiusX},set:function(a){this._radiusX=a},enumerable:!0},radiusY:{get:function(){return this._radiusY},set:function(a){this._radiusY=a},enumerable:!0},rootX:{get:function(){return this._rootX},set:function(a){this._rootX=a},enumerable:!0},rootY:{get:function(){return this._rootY},set:function(a){this._rootY=a},enumerable:!0},width:{get:function(){return this._width},set:function(a){this._width=a},enumerable:!0},height:{get:function(){return this._height},set:function(a){this._height=a},enumerable:!0}}),a.extend(c.prototype,{run:function(a,b,c){var d=a.depth,e=this.width;this.width===this.rootX&&this.rootX===this.radiusX&&0===this.rootX&&(e=b),0!==e&&(this.rootX=e/2,this.radiusX=this.rootX/d);var f=this.height;this.height===this.rootY&&this.rootY===this.radiusY&&0===this.rootY&&(f=c),0!==f&&(this.rootY=f/2,this.radiusY=this.rootY/d),this.layoutTree(a)},layoutTree:function(a){a.angle=0,a.x=this.rootX,a.y=this.rootY,a.rightBisector=0,a.rightTangent=0,a.leftBisector=b.TWO_PI,a.leftTangent=b.TWO_PI,this.layoutTreeN(1,[a])},layoutTreeN:function(c,d){var e=0,f=null,g=null,h=[];if(a.forEach(d,function(b){var d=b.children,i=b.rightLimit,j=(b.leftLimit-i)/d.length;a.forEach(d,function(a,b){if(a.angle=i+(b+.5)*j,a.x=this.rootX+c*this.radiusX*Math.cos(a.angle),a.y=this.rootY+c*this.radiusY*Math.sin(a.angle),a.hasChildren){h.push(a),null===f&&(f=a);var d=a.angle-e;a.rightBisector=a.angle-d/2,null!==g&&(g.leftBisector=a.rightBisector);var k=c/(c+1),l=2*Math.asin(k);a.leftTangent=a.angle+l,a.rightTangent=a.angle-l,e=a.angle,g=a}},this)},this),null!==f){var i=b.TWO_PI-g.angle;f.rightBisector=(f.angle-i)/2,g.leftBisector=f.rightBisector<0?f.rightBisector+b.TWO_PI+b.TWO_PI:f.rightBisector+b.TWO_PI}h.length>0&&this.layoutTreeN(c+1,h)}}),c});