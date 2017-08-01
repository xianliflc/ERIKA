var core = (function(erika){

    'use strict';

    function checkErikaExists(){
        if( erika === undefined){
            if( window.Erika !== undefined){
                erika = window.Erika();
            }
            else{
                console.log('Erika is not defined');
                return false;
            }
        }
    };


    return {
        exists: checkErikaExists,
    };

});
