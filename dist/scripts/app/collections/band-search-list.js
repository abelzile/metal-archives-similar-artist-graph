define(["underscore","backbone","app/models/band","app/collections/band-list","app/collections/band-related-list","app/collections/band-search-item-parser"],function(a,b,c,d,e,f){"use strict";return d.extend({parse:function(b){return 0===b.query.results.json.iTotalRecords?[]:a.map(b.query.results.json.aaData,function(a){var b=new f(a);return new c({id:b.getId(),name:b.getFullName(),genre:b.getGenre(),country:b.getCountry(),score:0,parentBand:null,relatedBands:new e})})}})});