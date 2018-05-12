window.Erika = window.Erika || {};

Erika.Object = (function(){

    class Component {
        constructor (name, properties, context) {
            this.name = name;
            this.context = context;
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                     this[key] = properties[key];
                }
            }
        }

        name() {
            return this.name;
        }

        use(extra_context) {
            this.context = Object.assign(this.context, extra_context);
            return this;
        }
    }

    var create = function(name, properties, context) {
        return new Component(name, properties, context);
    };

    var clone = function (compnt) {
        
    };

    return {
        'create' : create,
        'clone' : clone
    };
    
})();