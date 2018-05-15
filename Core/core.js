
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
            list.forEach(function(element){
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


    Erika.assets = (function(){

        var styles = {};
        var fonts = {};
        var scripts = {}; //scripts to load
        var images = {}; // images to load
        var total_scripts_to_load = 0;
        var loaded_scripts = 0;
        var total_images_to_load = 0;
        var loaded_images = 0;
        var validate = function(type) {
            if(type.trim().toLowerCase() === 'script') {
                return total_scripts_to_load === loaded_scripts;
            } else if (type.trim().toLowerCase() === 'image') {
                return total_images_to_load === loaded_images;
            } else if (type.trim().toLowerCase() === 'css') {
                //return;
            } else if (type.trim().toLowerCase() === 'font') {
                //return ;
            }

            return false;
        };

        var ScriptLoader = function() {

            var loadError = function(oError) {
                throw new URIError("The script " + oError.target.src + " didn't load correctly.");
            };

            var loadSuccess = function(event) {
                console.log("The script " + event.path[0].src  + " loaded correctly.");
            };

            var create = function (url, onsuccess, onerror) {
                var newScript = document.createElement("script");
                newScript.onerror = typeof onerror === 'function' ? onerror : loadError;
                if (typeof onsuccess === 'function') { 
                    newScript.onload = function(event) {
                        onsuccess(event);
                        scripts[url] = undefined;
                        loaded_scripts++;
                        delete scripts[url];
                    };    
                } else {
                    newScript.onload = function(event) {
                        loadSuccess(event);
                        scripts[url] = undefined;
                        loaded_scripts++;
                        delete scripts[url];
                    };
                }
                
                //newScript.src = url;
                if(!scripts.hasOwnProperty(url)) {
                    total_scripts_to_load++;
                }
                scripts[url] = newScript;
            };

            var sync = function() {
                for (const key in scripts) {
                    if (scripts.hasOwnProperty(key)) {
                        const element = scripts[key];
                        element.src = key;
                        document.head.appendChild(element);
                    }
                }
                
            };

            var async = function() {
                if (document.currentScript !== null) {
                    for (const key in scripts) {
                        if (scripts.hasOwnProperty(key)) {
                            const element = scripts[key];
                            element.src = key;
                            document.currentScript.parentNode.insertBefore(element, document.currentScript);
                        }
                    }
                } else {
                    sync();
                }
                
            };

            return {
                sync : sync,
                async: async,
                create: create,
            };
        };


        var ImageLoader = function() {

            var loadError = function(oError) {
                throw new URIError("The image " + oError.target.src + " didn't load correctly.");
            };

            var loadSuccess = function(event) {
                if ('naturalHeight' in this) {
                    if (this.naturalHeight + this.naturalWidth === 0) {
                        this.onerror();
                        return;
                    }
                } else if (this.width + this.height == 0) {
                    this.onerror();
                    return;
                }
                console.log("The image " + event.path[0].src + " loaded correctly.");
            };

            var create = function (url, onsuccess, onerror) {
                var image = new Image();
                image.onerror = typeof onerror === 'function' ? onerror : loadError;
                if (typeof onsuccess === 'function') { 
                    image.onload = function(event) {
                        if ('naturalHeight' in this) {
                            if (this.naturalHeight + this.naturalWidth === 0) {
                                this.onerror();
                                return;
                            }
                        } else if (this.width + this.height == 0) {
                            this.onerror();
                            return;
                        }

                        // document.body.appendChild(image);
                        onsuccess(event);
                        images[url] = undefined;
                        loaded_images++;
                        delete images[url];
                    };    
                } else {
                    image.onload = function(event) {
                        loadSuccess(event);
                        images[url] = undefined;
                        loaded_images++;
                        delete images[url];
                    };
                }
                
                //image.src = url;
                if (!images.hasOwnProperty(url)) {
                    total_images_to_load++;
                }
                images[url] = image;
            };

            var sync = function() {
                for (const key in images) {
                    if (images.hasOwnProperty(key)) {
                        images[key].src = key;
                        //document.head.appendChild(element);
                    }
                }
                
            };

            var async = function() {
                sync();
            };

            return {
                sync : sync,
                async: async,
                create: create,
            };
        };

        return {
            validate: validate,
            script: ScriptLoader,
            image: ImageLoader,
            
        };
    })();
})();

