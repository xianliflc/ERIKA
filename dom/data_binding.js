// window.Erika = window.Erika || {};

// Erika.binding = 
(function(){
    'use strict';

    // Data Model
    class DataModel {

        constructor (name, handlerList) {

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
            
            handlerList = typeof handlerList === 'object' ? handlerList : {};
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
                                handlerList[property_name][e].apply(null, event);
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
                        handler.apply(null, e);
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

        addView() {

        }

        sync() {

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
        
        constructor() {

        }

        render() {

        }

        sync() {

        }

        delay() {

        }

    }

    Erika.export('data_binding', {
        'model': DataModel,
        'view': DataView,
    });

})();