requirejs.config({
    enforceDefine: true,
    baseUrl: 'scripts/lib',
    paths: {
        jquery: './jquery/dist/jquery.min',
        lodash: './lodash/lodash.min',
        backbone: './backbone/backbone',
        text: './requirejs-text/text',
        app: '../app',
        lib: '../lib',
        templ: '../../templates'
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    shim: {
        "lib/jquery-dialogextend/jquery.dialogextend": {
            deps: ["lib/jqueryui-custom/jquery-ui.min"],
            exports: "jQuery.ui.dialogExtend"
        }
    }
});

define(["jquery",
        "underscore",
        "backbone",
        "app/collections/band-search-list",
        "app/views/app"],
    function ($,
              _,
              Backbone,
              BandSearchList,
              AppView) {

        "use strict";

        new AppView();

    }
);