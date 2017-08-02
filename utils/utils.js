var utils = (function(erika){

    'use strict';

    var libs = {

        'isArray' :     function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]' ;
        },

        'startsWith' :  function startsWith(body,str) {
            return
            body.indexOf(str) == 0;
        }
    };


    var utils = {
            'isArray' : libs.isArray,
            'startsWith' :  libs.startsWith
    };

    if (typeof erika !== undefined){
        if (typeof erika.utils !== undefined){
            // todo some extra logic
        }
    }

    erika.utils = utils;

    // if you want a return;
    return erika;

});
