
window.Erika = window.Erika || {};

(function () {

    'use strict';
    var resources = {
        'loader_cache' : {}
    };

    Erika.require = function __require(name, list) {
        var result = {};
        if (typeof name !== 'string' ){
            throw new Error('require name type must be string');
        }
        if (typeof name ==='string' && name.trim() === '') {
            throw new Error('require name is invalid');
        }

        if (!resources.loader_cache.hasOwnProperty(name)) {

            throw new Error('component ' + name + ' does not exist');
        }

        if (typeof list === 'string') {

            if (list === '*') {
                __loader_debug(name);
                return resources.loader_cache[name] || {};
            } else {
                if (!resources.loader_cache[name].hasOwnProperty(list)) {

                    throw new Error('component ' + list + ' does not exist in ' + name);
                }
                __loader_debug(name);
                return resources.loader_cache[name][list] || {}; 
            }
        } else if (Array.isArray(list)) {
            array.forEach(function(element){
                if (resources.loader_cache[name].hasOwnProperty(element)) {
                    result[element] = resources.loader_cache[name][element];
                } else {
                    throw new Error('component ' + element + ' does not exist in ' + name);
                }      
            });
            __loader_debug(name);
            return result;
        }
        
    };

    Erika.export = function __export(name, list) {

        // if (!Erika.hasOwnProperty('resources')) {
        //     Erika.resources = {};
        // }
        // var resources = Erika.resources;
        if (typeof name === 'string' && typeof list === 'object') {
            if (name.trim() !== '' && !resources.loader_cache.hasOwnProperty(name)) {
                resources.loader_cache[name] = list;
            } 

        } else {
            throw new Error('malformat in export');
        }
    };


    Erika.cache = (function () {

        var opt = (Erika.hasOwnProperty('config') && E.config.hasOwnProperty('cache')) ? Erika.config.cache : {'type' : 'default'}; 
        var local_st = function() {
            return {
                has: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = {};
                        return localStorage.getItem(index) !== null && (temp = JSON.parse(localStorage.getItem(index))) && temp.hasOwnProperty(key);
                    } else {
                        return localStorage.getItem(key) !== null;
                    }
                    
                },
                get: function(key,  default_value, index) {
                    index = typeof index === 'string' ? index : '';
                    
                    if (index !== '') {
                        
                        return this.has(key, index)? (function () {
                            var temp = JSON.parse(localStorage.getItem(index));
                            return temp[key];
                        })() : default_value;
                    } else {
                        return this.has(key)? localStorage.getItem(key) : default_value; 
                    }

                },

                set: function(key, value, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = localStorage.getItem(index) !== null ? JSON.parse(localStorage.getItem(index)) : {};
                        temp[key] = value;
                        localStorage.setItem(index, JSON.stringify(temp)); 
                    } else {
                        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
                    }
                    
                },

                remove: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = localStorage.getItem(index) !== null ? JSON.parse(localStorage.getItem(index)) : {};
                        temp = temp.hasOwnProperty(key) ? (function(){ 
                            temp[key] = undefined;
                            delete temp[key];
                            return temp;
                        })() : temp;
                        localStorage.setItem(index, JSON.stringify(temp)); 
                    } else {
                        localStorage.removeItem(key);
                    }
                },

                removeAll: function(index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        this.remove(index);
                    } else {
                        localStorage.clear();
                    }
                    
                }

            };
        };

        var session_st = function() {
            return {
                has: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = {};
                        return sessionStorage.getItem(index) !== null && (temp = JSON.parse(sessionStorage.getItem(index))) && temp.hasOwnProperty(key);
                    } else {
                        return sessionStorage.getItem(key) !== null;
                    }
                    
                },
                get: function(key,  default_value, index) {
                    index = typeof index === 'string' ? index : '';
                    
                    if (index !== '') {
                        
                        return this.has(key, index)? (function () {
                            var temp = JSON.parse(sessionStorage.getItem(index));
                            return temp[key];
                        })() : default_value;
                    } else {
                        return this.has(key)? sessionStorage.getItem(key) : default_value; 
                    }

                },

                set: function(key, value, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = sessionStorage.getItem(index) !== null ? JSON.parse(sessionStorage.getItem(index)) : {};
                        temp[key] = value;
                        sessionStorage.setItem(index, JSON.stringify(temp)); 
                    } else {
                        sessionStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
                    }
                    
                },

                remove: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        var temp = sessionStorage.getItem(index) !== null ? JSON.parse(sessionStorage.getItem(index)) : {};
                        temp = temp.hasOwnProperty(key) ? (function(){ 
                            temp[key] = undefined;
                            delete temp[key];
                            return temp;
                        })() : temp;
                        sessionStorage.setItem(index, JSON.stringify(temp)); 
                    } else {
                        sessionStorage.removeItem(key);
                    }
                },

                removeAll: function(index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        this.remove(index);
                    } else {
                        sessionStorage.clear();
                    }
                    
                },

                migrateTo: function() {
                    
                }

            };
        };

        var property_st = function(c) {

            return {
                has: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        return c.hasOwnProperty(index) && c[index].hasOwnProperty(key);
                    } else {
                        return c.hasOwnProperty(key);
                    }
                    
                },

                get: function(key, default_value, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        if (c.hasOwnProperty(index) && c[index].hasOwnProperty(key)) {
                            return c[index][key];
                        } else {
                            return default_value !== undefined ? default_value : '';
                        }
                    } else {
                        if (c.hasOwnProperty(key)) {
                            return c[key];
                        } else {
                            return default_value !== undefined ? default_value : '';
                        }
                    }

                },

                set: function(key, value, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '' && c.hasOwnProperty(index)) {
                        c[index][key] = value;
                    } else {
                        c[key] = value;
                    }
                    
                },

                remove: function(key, index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        c[index][key] = undefined;
                        delete c[index][key];
                    } else {
                        c[key] = undefined;
                        delete c[key];
                    }

                },

                removeAll: function(index) {
                    index = typeof index === 'string' ? index : '';
                    if (index !== '') {
                        c[index] = undefined;
                        delete c[index];
                    } else {
                        localStorage.clear();
                    }
                    
                }
            };
        };

        if (opt.hasOwnProperty('type') && (opt.type.toLowerCase() === 'localstorage' || opt.type.toLowerCase() === 'local') ) {
            return local_st();
        } else if (opt.hasOwnProperty('type') && (opt.type.toLowerCase() === 'session' || opt.type.toLowerCase() === 'sessionstorage') ) {
            return session_st();
        } else {
            Erika.storage = Erika.storage || {
                'templates': {},
                
            };

            if (opt.hasOwnProperty('name') && typeof opt.name === 'string' && opt.name !== '') {
                
                return property_st(Erika.storage.hasOwnProperty(opt.name)? 
                Erika.storage[opt.name] : (function() {
                    Erika.storage[opt.name] = {};
                                return Erika.storage[opt.name];
                            })());
            } else {
                return property_st(Erika.storage);
            }
            
        }

    })();

})();

