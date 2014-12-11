define(["jquery",
        "underscore",
        "backbone",
        "lib/jqueryui-custom/jquery-ui.min",
        "lib/jquery-dialogextend/jquery.dialogextend"],

    function($,
             _,
             Backbone){

        "use strict";

        return Backbone.View.extend({

            el: "#about",

            initialize: function() {

                this.$el.dialog({
                    autoOpen: true,
                    closeOnEscape: false,
                    draggable: true,
                    height: 200,
                    modal: false,
                    position: { my: "right top", at: "right top", of: window },
                    resizable: false,
                    title: "About",
                    width: 400
                }).dialogExtend({
                    closable: false,
                    collapsable: true
                }).show("fast");

            }

        });

    }
);