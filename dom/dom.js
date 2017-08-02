var dom = (function(erika){

    'use strict';

    var libs = {

    };


    var dom = {

    };

    if (typeof erika !== undefined){
        if (typeof erika.utils !== undefined){
            // todo some extra logic
        }
    } else {
        console.log("ERROR: ERIKA is not defined");
        return;
    }

    erika.dom = dom;

    // if you want a return;
    return erika;
});
