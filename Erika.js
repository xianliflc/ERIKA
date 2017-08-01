var Erika = (function (options) {

    'use strict';

    var resources = {
        'filters' : { },
        'constants' : { },
        'factory' : { },
        '$er' : { },
        'mode' : null,
        'root' : '/',
        'routes' : [],
        'controller' : { },
        'controller_dependancy':{ },

        // setup mode and root of the app
        'config': function(options) {
            resources.mode = options && options.mode && options.mode === 'history'
                        && !!(history.pushState) ? 'history' : 'hash';
            resources.root = (options && options.root )? '/' + resources.clearSlashes(options.root) + '/' : '/';
        },

        // get info after "?" or "#" in url
        'getFragment': function() {
            var fragment = '';
            if(resources.mode === 'history') {
                fragment = resources.clearSlashes(decodeURI(location.pathname + location.search));
                fragment = fragment.replace(/\?(.*)$/, '');
                fragment = resources.root !== '/' ? fragment.replace(resources.root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return resources.clearSlashes(fragment);
        },

        // remove '/' in begining and end
        'clearSlashes': function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },

        //
        'check': function (hash) {
            var reg, keys, match, routeParams;
            for (var i = 0, max = resources.routes.length; i < max; i++ ) {
                routeParams = {}
                keys = resources.clearSlashes(resources.routes[i].path).match(/:([^\/]+)/g);
                match = hash.match(new RegExp(resources.clearSlashes(resources.routes[i].path).replace(/:([^\/]+)/g, "([^\/]*)")));
                console.log(resources.routes[i].path);
                if (match) {
                    match.shift();
                    match.forEach(function (value, i) {
                        routeParams[keys[i].replace(":", "")] = value;
                    });
                    var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        LDependancy.push(routeParams);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        //break;
                }
                else{
                    if(resources.clearSlashes(resources.routes[i].path) == hash){
                        //load dependency and call
                        var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        //break;
                    }
                }
            }
        },

        //
        'listen': function() {
            var current = "/";
            var fn = function() {
                if(current !== resources.getFragment()) {
                    current = resources.getFragment();
                    resources.check(current);
                }
            }
            if(resources.mode === 'hash'){
                clearInterval(this.interval);
                this.interval = setInterval(fn, 50);
            }
            if(resources.mode === 'history'){
                this.interval = setTimeout(fn, 50);
            }
        },
    },
    api = {
        // get filter entry
        'filters': function (key, val) {
            resources.filters[key] = val;
        },

        // add a factory component to tha app
        'factory': function (key, arrayArg) {
            if (key === undefined ){
                console.log("Error: factory undefined key");
                return;
            }

            if (arrayArg === undefined || ! arrayArg instanceof Array){
                console.log("Error: factory invalid args");
                return;
            }

            // if the factory has any parameter
            if (arrayArg.length > 1){
                var last_index = arrayArg.length-1;
                var dependancies = arrayArg.slice(0, -1);
                if (typeof arrayArg[last_index] === "function") {
                    console.log(api.loadDependancies(dependancies));

                    // use arrayargs to call the dependency
                    resources.factory[key] = arrayArg[last_index].apply(this, api.loadDependancies(dependancies)); // arrayArg[last_index];
                } else {
                    console.log("Error: factory is not a function");
                }
            }

            // if the factory does not have parameter at all
            else if (arrayArg.length == 1){
                if (typeof arrayArg[0] === "function") {
                    console.log("- null dependency");
                    resources.factory[key] = arrayArg[0].apply(this, []);
                } else {
                    console.log("Error: factory is not a function");
                }
            }
            else{
                console.log("Error: factory undefined function");
            }
        },

        // add binding or pth - controller to routes
        'routes' :  function(route, controller){
            var temp = {'path':route, 'handler':controller };
            resources.routes.push(temp);
        },

        //
        'controller' : function(controller, handler){

            if (controller === undefined ){
                console.log("Error: controller undefined name");
                return;
            }

            if (handler === undefined || ! handler instanceof Array){
                console.log("Error: controller invalid args");
                return;
            }

            if (handler.length > 1){
                var last_index = handler.length-1;
                var dependancies = handler.slice(0, -1);

                if (typeof handler[last_index] === "function") {
                    resources.controller[controller] = handler[last_index];
                    resources.controller_dependancy[controller] =  dependancies;
                } else {
                    console.log("Error: Controller is not a function");
                }
            }
            else if (handler.length == 1) {
                if (typeof handler[0] === "function") {
                    resources.controller[controller] = handler[0];
                    resources.controller_dependancy[controller] =  [null];
                } else {
                    console.log("Error: Controller is not a function");
                }
            } else {
                console.log("Error: controller undefined function");
            }
        },

        // load dependencies from different places
        'loadDependancies' : function(arrayArg){

            if (arrayArg === undefined || ! array instanceof Array){
                console.log("Error: dependencies loading");
                return;
            }

            var dependancy = [], iter;
            for (iter = 0; iter < arrayArg.length; iter += 1) {
                if (typeof arrayArg[iter] === "string") {
                    //look in modules
                    if (resources.hasOwnProperty(arrayArg[iter])){
                        dependancy.push(api.loadModule(arrayArg[iter]));
                    } else {
                    //look in factory
                    if (resources.factory.hasOwnProperty(arrayArg[iter])) {
                        dependancy.push(api.loadDependancy(arrayArg[iter]));
                    } else {
                            //look in constants in modules
                            if (resources.constants.hasOwnProperty(arrayArg[iter])) {
                                dependancy.push(api.loadConstant(arrayArg[iter]));
                            } else {
                                //if it is $er scope
                                if (arrayArg[iter] === "$er") {
                                    dependancy.push({});
                                } else {
                                    console.log("Error: " + arrayArg[iter] + " is not Found in constants and Factories");
                                }
                            }
                        }
                    }
                }
            }
            return dependancy;
        },

        'loadModule': function (key) {
            return resources[key];
        },

        'loadDependancy': function (key) {
            return resources.factory[key];
        },

        'loadConstant': function (key) {
            return resources.constants[key];
        },

        'constants': function (key, val) {
            resources.constants[key] = val();
        },

        // load and apply $er modules
        'module': function(key, arrayArg){

            if (key === undefined || key === ''){
                console.log("Error: module invalid name - undefined or empty");
                return;
            }

            if (arrayArg === undefined || ! arrayArg instanceof Array){
                console.log("Error: module invalid args");
                return;
            }

            // check if this is a $er module
            if(key.startsWith('$er')){
                if (array.length > 1){
                    var last_index = arrayArg.length-1;
                    var dependancies = arrayArg.slice(0, -1);
                    if (typeof arrayArg[last_index] === "function") {
                        console.log (api.loadDependancies(dependancies));
                        resources[key.substring(3, key.length)] = arrayArg[last_index].apply(this, api.loadDependancies(dependancies)); // arrayArg[last_index];
                    } else {
                        console.log("Error: module is not a function");
                    }
                }
                else if (array.length == 1 ){
                    if (typeof arrayArg[0] === "function") {
                        console.log ('null dependencies');
                        resources[key.substring(3, key.length)] = arrayArg[0].apply(this, []);
                    } else {
                        console.log("Error: module is not a function");
                    }
                } else {
                    console.log("Error: module undefined function");
                }
            }
            else{
                console.log("Error in module "+key+": should starts with $er");
            }
        }
    };


    function filters() {
        api.filters(arguments[0], arguments[1]);
    }

    function factory() {
        api.factory(arguments[0], arguments[1]);
    }

    function constants() {
        api.constants(arguments[0], arguments[1]);
    }

    function routes(){
        api.routes(arguments[0], arguments[1]);
    }

    function controller(){
        api.controller(arguments[0], arguments[1]);
    }

    function module(){
        api.module(arguments[0], arguments[1]);
    }

    function initiate(){

        resources.config({mode :'history'});
        resources.listen();

        if (typeof String.prototype.startsWith != 'function') {
          // see below for better implementation!
          String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
          };
        }
    }

    // for internal debug
    function printFactories(){
        console.log(resources.factory);
    }

    initiate();

    return {
        'filters': filters,
        'factory': factory,
        'routes': routes,
        'controller': controller,
        'constants': constants,
        'module': module
    }
});
