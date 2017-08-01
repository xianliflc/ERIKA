var logger = (function(erika, env){

    var trace = [];
    env = env || 'production';

    function log(obj, message){
        if ( env === 'development'){
            trace.push([obj,message]);
            print(obj, message, env);
        }else{
            trace.push([obj,message]);
        }
    }

    function print(obj, message, env){
        if (typeof obj === 'object' ){
            if(env === 'development'){
                try{
                    console.log(message + ": " + JSON.stringify(obj));
                }
                catch(Error){
                    trace.push([obj, 'invalid JSON']);
                }

            }else{
                console.log(message);
            }
        }
        else if(typeof obj === 'function'){
            if(env === 'development'){
                try{
                    console.log(message + ": " + obj.name + " : called by : " + obj.caller);
                }
                catch(Error){
                    trace.push([obj, 'invalid function']);
                }

            }else{
                console.log(message + ": " + obj.name);
            }
        } else {
            console.log(message + ": " + obj);
        }
    }

    function getLogger(){
        env = env || 'production';
//        erika.logger = (function(){
//            return
//        });

    }

    function printTrace(obj){
        if (obj !== undefined){
            var temp = [];
            trace.forEach(function(item){
                if(item[0] === obj){
                    temp.push(item);
                }
            });

            temp.forEach(function(item){
                console.log(item);
            });
        }
        else {
            console.log(trace);
        }
    }

});
