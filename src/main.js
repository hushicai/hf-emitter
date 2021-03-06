/**
 * @file Emitter
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        /**
         * Emitter
         *
         * @constructor
         */
        function Emitter() {
            this._events = undefined;
            this._maxListeners = 10;
        }

        Emitter.prototype.setMaxListeners = function (n) {
            this._maxListeners = n;
            return this;
        };

        /**
         * on
         *
         * @public
         * @param {string} type 事件类型
         * @param {Function} listener 监听器
         * @return {Emitter}
         */
        Emitter.prototype.on = function (type, listener) {
            this._events = this._events || {};
            this._events[type] = this._events[type] || [];
            var events = this._events[type];
            var num = events.length;

            if (num >= this._maxListeners) {
                throw new RangeError('warning: possible memory leak detected. ' + num + ' listeners added.');
            }

            events.push(listener);

            return this;
        };

        /**
         * off
         *
         * @public
         * @param {string} type 事件类型
         * @param {Function} listener 监听器
         * @return {Emitter}
         */
        Emitter.prototype.off = function (type, listener) {
            // 释放所有事件
            if (!type) {
                this._events = undefined;
                return this;
            }

            if (!listener) {
                delete this._events[type];
                return this;
            }

            var list = this._events[type];
            var length = list.length;
            for (var i = length - 1; i >= 0; i--) {
                if (listener === list[i]) {
                    list.splice(i, 1);
                    break;
                }
            }

            return this;
        };

        /**
         * emit
         *
         * @public
         * @param {string} type 事件名
         * @return {Emitter}
         */
        Emitter.prototype.emit = function (type) {
            if (!this._events) {
                return this;
            }
            var list = this._events[type];
            if (!list || list.length === 0) {
                return this;
            }
            var temp = list.slice();
            var args = [].slice.call(arguments, 1);
            for (var i = list.length - 1; i >= 0; i--) {
                temp[i].apply(this, args);
            }

            return this;
        };

        Emitter.mixin = function (obj) {
            var extend = require('hf-util/extend');
            var proto = Emitter.prototype;
            return extend(obj, proto);
        };

        return Emitter;
    }
);
