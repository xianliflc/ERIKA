var __loader_debug = function(name) {
    console.log('components: ' + name + ' is loaded');
};

var Erika = (function (options) {

    'use strict';

    var resources = {
            'filters': {},
            'constants': {},
            'factory': {},
            '$er': {},
            'mode': null,
            'root': '/',
            'routes': [],
            'page' : {},
            'controller': {},
            'controller_dependancy': {},
            'utils': {},
            'loader_cache': {},
            'config': options || {},
            // setup mode and root of the app
            'setup': function () {
                
                resources.mode = options && options.mode && options.mode === 'history' &&
                    !!(history.pushState) ? 'history' : 'hash';
                resources.root = (options && options.root) ? '/' + resources.clearSlashes(options.root) + '/' : '/';
            },

            // get info after "?" or "#" in url
            'getFragment': function () {
                var fragment = '';
                if (resources.mode === 'history') {
                    fragment = resources.clearSlashes(decodeURI(location.pathname + location.search));
                    fragment = fragment.replace(/\?(.*)$/, '');
                    fragment = resources.root !== '/' ? fragment.replace(resources.root, '') : fragment;
                } else {
                    var match = window.location.href.match(/#(.*)$/);
                    fragment = match ? match[1] : '';
                }
                return resources.clearSlashes(fragment);
            },

            'clearSlashes': function (path) {
                return path.toString().replace(/\/$/, '').replace(/^\//, '');
            },

            //
            'check': function (hash) {
                var reg, keys, match, routeParams;
                for (var i = 0, max = resources.routes.length; i < max; i++) {
                    routeParams = [];
                    keys = resources.clearSlashes(resources.routes[i].path).match(/(&[^\/&]+)/g);

                    var pure_hash =hash.replace(/&([^\/]+)/g, "");
                    var pure_path = '^' + resources.clearSlashes(resources.routes[i].path).replace(/&([^\/]+)/g, "") + '$';
                    var match_pure_hash = pure_hash.match(pure_path);

                    if (!match_pure_hash) {
                        continue;
                    }
                    
                    var regex_string = resources.clearSlashes(resources.routes[i].path).replace(/&([^\/]+)/g, "([^\/]*)");

                    match = hash.match(new RegExp(regex_string));

                    if (match) {
                        if (keys !== null && keys.length > 0) {
                            var keys_with_type = {};

                            keys.forEach(function (item, i){
                                 var v = item.split('@');
    
                                 keys_with_type[v[0].split('&')[1]] = v[1] !== undefined ? v[1] : ''; 
                            });
    
                            var matches = match[1].split('&');
                            matches.shift();
                            matches.forEach(function (item, i) {
                                var arr =item.split('=');
                                var key = arr[0];
                                var value = arr[1] !== undefined ? arr[1] : '';
    
                                if (keys_with_type[key] !== undefined) {
                                    switch(keys_with_type[key]) {
                                        case 'array':
                                        case 'object':
                                            value = JSON.parse(value);
                                            api.pageDependency(key, value);
                                            break;
                                        case 'string':
                                            api.pageDependency(key, value);
                                            break;
                                        case 'integer':
                                        case 'int':
                                            value = parseInt(value);
                                            api.pageDependency(key, value);
                                            break;
                                        case 'float':
                                            api.pageDependency(key, value);
                                            value = parseFloat(value);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                
                            });                           
                        }

                        
                        var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        break;
                    } else {
                        //load dependency and call
                        var LDependancy = api.loadDependancies(resources.controller_dependancy[resources.routes[i].handler]);
                        resources.controller[resources.routes[i].handler].apply(this, LDependancy);
                        break;
                    }
                }
            },

            //
            'listen': function () {
                var current = "/";
                var fn = function () {
                    if (current !== resources.getFragment()) {
                        //console.log(current, resources.getFragment());
                        current = resources.getFragment();
                        resources.check(current);
                    }
                };

                if (resources.mode === 'hash') {
                    clearInterval(this.interval);
                    this.interval = setInterval(fn, 50);
                }

                if (resources.mode === 'history') {
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
                if (key === undefined) {
                    console.log("Error: factory undefined key");
                    return;
                }

                if (arrayArg === undefined || !(arrayArg instanceof Array)) {
                    console.log("Error: factory invalid args");
                    return;
                }

                // if the factory has any parameter
                if (arrayArg.length > 1) {
                    var last_index = arrayArg.length - 1;
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
                else if (arrayArg.length == 1) {
                    if (typeof arrayArg[0] === "function") {
                        console.log("- null dependency");
                        resources.factory[key] = arrayArg[0].apply(this, []);
                    } else {
                        console.log("Error: factory is not a function");
                    }
                } else {
                    console.log("Error: factory undefined function");
                }
            },

            // add binding or pth - controller to routes
            'routes': function (route, controller) {
                var temp = {
                    'path': route,
                    'handler': controller
                };
                resources.routes.push(temp);
            },

            //
            'controller': function (controller, handler) {

                if (controller === undefined) {
                    console.log("Error: controller undefined name");
                    return;
                }

                if (handler === undefined || !(handler instanceof Array)) {
                    console.log("Error: controller invalid args");
                    return;
                }

                if (handler.length > 1) {
                    var last_index = handler.length - 1;
                    var dependancies = handler.slice(0, -1);

                    if (typeof handler[last_index] === "function") {
                        resources.controller[controller] = handler[last_index];
                        resources.controller_dependancy[controller] = dependancies;
                    } else {
                        console.log("Error: Controller is not a function");
                    }
                } else if (handler.length == 1) {
                    if (typeof handler[0] === "function") {
                        resources.controller[controller] = handler[0];
                        resources.controller_dependancy[controller] = [null];
                    } else {
                        console.log("Error: Controller is not a function");
                    }
                } else {
                    console.log("Error: controller undefined function");
                }
            },

            // load dependencies from different places
            'loadDependancies': function (arrayArg) {

                if (arrayArg === undefined || !(arrayArg instanceof Array)) {
                    console.error("Error: dependencies loading");
                    return;
                }

                var dependancy = [],
                    iter;
                
                for (iter = 0; iter < arrayArg.length; iter += 1) {
                    if (typeof arrayArg[iter] === "string") {
                        //look in modules
                        if (resources.hasOwnProperty(arrayArg[iter])) {
                            dependancy.push(api.loadModule(arrayArg[iter]));
                        } else if (arrayArg[iter].startsWith('$er') && arrayArg[iter] !== '$er' && resources['$er'].hasOwnProperty(arrayArg[iter].substring(3, arrayArg[iter].length)) ) {
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
                                        //dependancy.push();
                                    } else if (resources.page.hasOwnProperty(arrayArg[iter])) {
                                        dependancy.push(api.loadPageDepedency(arrayArg[iter]));
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
                if (key.startsWith('$er')) {
                    return resources['$er'][key.substring(3, key.length)];
                } else {
                    return resources[key];
                }
            },

            'loadDependancy': function (key) {
                return resources.factory[key];
            },

            'loadPageDepedency': function (key) {
                return resources.page[key];
            },

            'loadConstant': function (key) {
                return resources.constants[key];
            },

            'pageDependency': function (key, val) {
                resources.page[key] = val;
            },

            'constants': function (key, val) {
                resources.constants[key] = val();
            },

            // load and apply $er modules
            'module': function (key, arrayArg) {

                if (key === undefined || key === '') {
                    console.error("Error: module invalid name - undefined or empty");
                    return;
                }

                if (arrayArg === undefined || !(arrayArg instanceof Array)) {
                    console.error("Error: module invalid args");
                    return;
                }

                // check if this is a $er module for run-time
                if (key.startsWith('$er')) {
                    if (arrayArg.length > 1) {
                        var last_index = arrayArg.length - 1;
                        var dependancies = arrayArg.slice(0, -1);
                        if (typeof arrayArg[last_index] === "function") {
                            //console.log(api.loadDependancies(dependancies));
                            resources['$er'][key.substring(3, key.length)] = arrayArg[last_index].apply(this, api.loadDependancies(dependancies)); // arrayArg[last_index];
                        } else {
                            console.error("Error: module is not a function");
                        }
                    } else if (arrayArg.length == 1) {
                        if (typeof arrayArg[0] === "function") {
                            resources['$er'][key.substring(3, key.length)] = arrayArg[0].apply(this, []);
                        } else {
                            console.error("Error: module is not a function");
                        }
                    } else {
                        console.error("Error: module undefined function");
                    }
                } else {
                    console.error("Error in module " + key + ": should starts with $er");
                }
                //console.log(resources);
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

    function routes() {
        api.routes(arguments[0], arguments[1]);
    }

    function controller() {
        api.controller(arguments[0], arguments[1]);
    }

    function module() {
        api.module(arguments[0], arguments[1]);
    }

    function initiate() {
        resources.setup();

        resources.listen();

        if (typeof String.prototype.startsWith !== 'function') {
            // see below for better implementation!
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        build();
    }

    function build() {

    }

    function version() {
        return '0.0.7';
    }

    // for internal debug
    function printFactories() {
        console.log(resources.factory);
    }

    function cacheFactory(config) {
        Erika.cache(options.cache || {'type': 'default'});
    }

    initiate();
    
    return {
        'filters': filters,
        'factory': factory,
        'routes': routes,
        'controller': controller,
        'constants': constants,
        'module': module,
        'version':  version,
        'config' : resources.config,
        'cacheFactory' : cacheFactory,
        
    };
});
