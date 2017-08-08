var utils = (function(){

    'use strict';

    var libs = {

        'isArray' :     function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]' ;
        },

        'startsWith' :  function startsWith(body,str) {
            return
            body.indexOf(str) == 0;
        },

        'indexOf'   :   function() {},
    };

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item) {
            for(var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    var utils = {
            'isArray' : libs.isArray,
            'startsWith' :  libs.startsWith,
            'indeOf'    :   libs.indexOf
    };

    if (typeof window.erika !== undefined){
        if (typeof window.erika.utils !== undefined){
            // todo some extra logic
        }
    } else {
        console.log("ERROR: ERIKA is not defined");
        return;
    }

    window.erika.utils = utils;

    // if you want a return;
    return window.erika;
});
