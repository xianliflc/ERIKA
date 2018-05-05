window.Erika = window.Erika || {};

(function (E) {

    'use strict';

    var libs = {

        'isArray': function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },

        'startsWith': function startsWith(body, str) {
            return body.indexOf(str) === 0;
        },

        'indexOf': function () {},
    };

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    var utils = {
        'isArray': libs.isArray,
        'startsWith': libs.startsWith,
        'indeOf': libs.indexOf
    };

    E.utils = utils;
    
})(Erika || {});
