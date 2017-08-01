var utils = (function(erika){

    'use strict';

    function isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    }


    return {
        issArray: isArray,
    };

});
