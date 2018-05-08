window.Erika = window.Erika || {};

Erika.Object = (function(){

    class Component {
        constructor (name, properties, context) {
            this.name = name;
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                     this[key] = properties[key];
                }
            }
        }
    }

    var create = function(name, properties, context) {
        return new Component(name, properties, context);
    };

    return {
        'create' : create,
    };
    
})();