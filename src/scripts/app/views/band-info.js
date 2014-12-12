define(["jquery",
        "underscore",
        "backbone",
        "text!templ/info-dialog.html",
        "app/models/band",
        "app/utils/country-codes",
        "lib/jqueryui-custom/jquery-ui.min"],
    function ($,
              _,
              Backbone,
              Template,
              Band,
              CountryCodes) {

        "use strict";

        return Backbone.View.extend({

            visible: false,

            model: Band,

            template: _.template(Template),

            dlg: null,

            initialize: function() {

                this.dlg = $("#band-info-dialog").dialog({
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    show: 100,
                    hide: 100
                });

            },

            render: function(options) {

                options = options || { position: { my: "center", at: "center", of: window } };

                var mdl = this.model.toJSON();

                var cou = CountryCodes[mdl.country];

                _.extend(mdl, {
                    countryCode: CountryCodes[mdl.country]
                });

                this.$el.html(this.template(mdl));

                this.dlg
                    .dialog("option", { title: this.model.get("name"), position: options.position })
                    .dialog("open");

                return this;

            }

        });

    }

);