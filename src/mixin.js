/**
 * @file mixin
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var Emitter = require('./main');
        var extend = require('hf-util/extend');

        function mixin(obj) {
            var proto = Emitter.prototype;
            return extend(obj, proto);

        }
        return mixin;
    }
);
