define(["app/utils/number-ext"],

    function(NumberExt) {

        "use strict";

        function MathExt() {
        }

        Object.defineProperties(MathExt, {

           TWO_PI: {
               value: Math.PI * 2,
               writable: false,
               enumerable: false,
               configurable: false
           }

        });

        MathExt.randomInt = function(min, max) {

            min = NumberExt.toInteger(min);
            max = NumberExt.toInteger(max);

            return NumberExt.toInteger(Math.random() * (max - min)) + min;

        };

        MathExt.clamp = function(value, min, max) {

            return Math.min(Math.max(value, min), max);

        };

        return MathExt;

    }

);