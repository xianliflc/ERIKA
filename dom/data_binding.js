// window.Erika = window.Erika || {};

// Erika.binding = 
(function(){
    'use strict';

    // Data Model
    class DataModel {

        constructor (name, handlerList, views) {

            var elements = document.querySelectorAll('[erika-model='+name+']');

            if (elements.length < 1) {
                throw new Error ("data model for name " + name + " not found");
            } 
            else if (elements.length > 1) {
                throw new Error('data model for name ' + name + ' must be unique');
            }

            var properties = Erika.Dom.get('[erika-model='+name+'] [erika-model_property]');

            this.element = Erika.Dom.get(elements[0]);
            this.views = {};
            this.properties = {};
            this._event_cache = [];
            this.isDelayed = false;
            this.name = name;
            
            handlerList = typeof handlerList === 'object' ? handlerList : {};
            views = typeof views === 'object' ? views : {};

            for (const key in views) {
                if (views.hasOwnProperty(key)) {
                    this.views[key] = new DataView(key, views[key].function? views[key].function : false, views[key].options? views[key].options : false);
                }
            }

            views = undefined;

            var self = this;
            for (const key in properties) {
                
                if (Erika.utils.isElement(properties[key])) {
                    
                    let ele = Erika.Dom.get(properties[key]);
                    let property_name = properties[key].getAttribute('erika-model_property');
                    let types = ele.attr('erika-model_property_type') || 'default';
                    types = types.split(' ');
                    types.forEach(e => {
                        ele.on( e === 'default' ? 'click' : e, function(event){
                            if (handlerList.hasOwnProperty(property_name) && 
                            handlerList[property_name].hasOwnProperty(e) && 
                            typeof handlerList[property_name][e] === 'function' &&
                            self.isDelayed === false) {
                                handlerList[property_name][e].apply({'views' : self.views}, event);
                            } else {
                                self._event_cache.push({
                                    'event' : event,
                                    'property_name' : property_name,
                                    'type' : e
                                });
                            }
                        });
                    });
                    this.properties[property_name] = ele;
                }
            }
            properties = null;
        }

        addHandler(property_name, event, handler) {
            if (this.properties.hasOwnProperty(property_name)) {
                event = event === 'default' ? 'click' : event;
                var self = this;
                this.properties[property_name].on(event, function(e) {
                    if (self.isDelayed === false) {
                        handler.apply({'views' : self.views}, e);
                    } else {
                        self._event_cache.push({
                            'event' : e,
                            'property_name' : property_name,
                            'type' : event
                        });
                    }
                });
            }
            return this;
        }

        addView(name, func, self) {
            self = self || this ;
            self.views[name] = new DataView(name, func);
            return self;
        }

        addViews(list) {
            for (const key in list) {
                if (list.hasOwnProperty(key)) {
                    const element = list[key];
                    this.addView(list[key].name, list[key].function);
                }
            }
            return this;
        }

        /**
         * Delay the trigger of event listener
         * @param {*} time 
         */
        wait(time) {
            if (!Number.isInteger(time)) {
                throw new Error('delay() time must be integer');
            } else {
                var self = this;
                this.isDelayed = setTimeout(function(){
                    self.isDelayed = false;
                    self._event_cache.forEach((cache, index) => {
                        const event = cache.event;
                        const property = cache.property_name;
                        const type = cache.type === 'default' ? 'click' : cache.type;
                        self.properties[property].trigger(type, event);
                        self._event_cache[index] = undefined;
                        delete(self._event_cache[index]);
                    });
                    
                }, time);
            }
            return this;
        }

        /**
         * 
         */
        resume() {
            if (this.isDelayed !== false) {
                clearTimeout(this.isDelayed);
            }
            this.isDelayed = false;
            return this;
        }
    }

    class DataView {
        
        constructor(select, fn) {
            
            var elements = document.querySelectorAll('[erika-view='+select+']');

            if (elements.length < 1) {
                throw new Error ("data view for name " + name + " not found");
            } 
            else if (elements.length > 1) {
                throw new Error('data view for name ' + name + ' must be unique');
            }

            this.view = Erika.Dom.get(select);
            if (typeof fn === 'function') {
                var self = this;
                this.render = function(data, callback){
                    
                    if (typeof callback === 'function') {
                        callback(fn.apply(self,data));
                    } else {
                        fn.apply(self,data);
                    }
                    return self;
                };
            }

        }

        render(data, callback) {
            throw new Error('render() has to be implmented');
        }

        wait() {
            return this;
        }
    }

    Erika.export('data_binding', {
        'model': DataModel,
        'view': DataView,
    });

})();