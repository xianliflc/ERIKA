
window.Erika = window.Erika || {};

(function () {

    'use strict';

    Erika.factory('$er_event', ['constants', function(constants){

        const self = this;

        let event = function(opts){
            this.context = opts.context || {};
            this.scope = opts.scope || 'default';

        };

        event.prototype = {
            
            'trigger': function() {

            },

            'on': function() {

            },

            'off': function() {

            }

        };
        
        let create = function(opts){
            return new event(opts);
        };

        let clone = function (obj) {
            return self.clone(obj);
        };

        return {
            'create' : create,
            'clone' : clone
        };

    }]);

})