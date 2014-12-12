define(["jquery","underscore","backbone","text!templ/info-dialog.html","app/models/band","app/utils/country-codes","lib/jqueryui-custom/jquery-ui.min"],function($,_,Backbone,Template,Band,CountryCodes){"use strict";return Backbone.View.extend({visible:!1,model:Band,template:_.template(Template),dlg:null,initialize:function(){this.dlg=$("#band-info-dialog").dialog({autoOpen:!1,modal:!0,resizable:!1,show:100,hide:100})},render:function(options){options=options||{position:{my:"center",at:"center",of:window}};{var mdl=this.model.toJSON();CountryCodes[mdl.country]}return _.extend(mdl,{countryCode:CountryCodes[mdl.country]}),this.$el.html(this.template(mdl)),this.dlg.dialog("option",{title:this.model.get("name"),position:options.position}).dialog("open"),this}})});