define(["jquery",
        "underscore"],
    function($, _){

        "use strict";

        function BandSearchItemParser(searchResult){

            if (_.isArray(searchResult)) {
                this._searchResult = searchResult; // Single band returned by search.
            } else {
                this._searchResult = searchResult.json; // Multiple bands returned by search.
            }

        }

        BandSearchItemParser.AKA_TOKEN = "<strong>a.k.a.</strong>";

        BandSearchItemParser.prototype.getId = function() {

            var str = this._searchResult[0];
            var end = str.indexOf("</a>") + 4;
            var a = str.substring(0, end);
            var url = a.match(/".*?"/);
            var urlParts = url[0].substr(1, url[0].length - 2).split("/");

            return urlParts[urlParts.length - 1];

        };

        BandSearchItemParser.prototype.getName = function() {

            var str = this._searchResult[0];
            var end = str.indexOf("</a>") + 4;
            var a = str.substring(0, end);

            return a.substring(a.indexOf(">") + 1, a.indexOf("</a>"));

        };

        BandSearchItemParser.prototype.getAka = function() {

            var str = this._searchResult[0];
            var akaIndex = str.indexOf(BandSearchItemParser.AKA_TOKEN);

            if (akaIndex > -1) {
                return str.substring(akaIndex + BandSearchItemParser.AKA_TOKEN.length, str.lastIndexOf(")"));
            }

            return "";

        };

        BandSearchItemParser.prototype.getFullName = function() {

            var name = this.getName();
            var aka = this.getAka();

            if (aka !== "") {
                return name + " (a.k.a. " + aka + ")";
            }

            return name;

        };

        BandSearchItemParser.prototype.getGenre = function() {

            return this._searchResult[1];

        };

        BandSearchItemParser.prototype.getCountry = function() {

            return this._searchResult[2];

        };

        return BandSearchItemParser;

    }
);